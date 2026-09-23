from rest_framework import mixins, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .filters import IssueFilter
from .models import Issue, Skill, Tag
from .pagination import StandardPagination
from .serializers import (
    IssueDetailSerializer, IssueListSerializer, IssueWriteSerializer,
    SkillSerializer, TagSerializer,
)
from .services import import_service, search as search_service, stats_service
from .services.scoring import apply_priority_to_issue


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    pagination_class = StandardPagination
    filterset_class = IssueFilter
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "updated_at",
                       "knowledge_priority", "severity", "title"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in ("list",):
            return IssueListSerializer
        if self.action in ("retrieve",):
            return IssueDetailSerializer
        return IssueWriteSerializer

    def perform_create(self, serializer):
        issue = serializer.save()
        apply_priority_to_issue(issue)

    def perform_update(self, serializer):
        issue = serializer.save()
        apply_priority_to_issue(issue)


class TagViewSet(mixins.ListModelMixin,
                 mixins.CreateModelMixin,
                 mixins.DestroyModelMixin,
                 viewsets.GenericViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = None


class SkillViewSet(mixins.ListModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    pagination_class = None

    def retrieve(self, request, *args, **kwargs):
        skill = self.get_object()
        data = self.get_serializer(skill).data
        data["recent_issues"] = IssueListSerializer(
            skill.issues.all()[:5], many=True
        ).data
        return Response(data)


@api_view(["GET"])
def search_view(request):
    q = request.query_params.get("q")
    severity = request.query_params.getlist("severity")
    status_ = request.query_params.getlist("status")
    tags = request.query_params.getlist("tag")
    category = request.query_params.get("category")
    ordering = request.query_params.get("ordering")

    qs = search_service.search_issues(
        q=q, severity=severity, status=status_,
        tags=tags, category=category, ordering=ordering,
    )
    print("before search")

    qs = search_service.search_issues(
        q=q,
        severity=severity,
        status=status_,
        tags=tags,
        category=category,
        ordering=ordering,
    )

    print("after search")
    print("SQL:", qs.query)

    print("before evaluation")
    print("count:", qs.count())

    print("after evaluation")

    paginator = StandardPagination()
    page = paginator.paginate_queryset(qs, request)

    paginator = StandardPagination()
    page = paginator.paginate_queryset(qs, request)
    serializer = IssueListSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["POST"])
def import_preview(request):
    text = (request.data or {}).get("template", "")
    if not text.strip():
        return Response(
            {"template": ["No template provided"]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        return Response(import_service.preview_issue(text))
    except import_service.TemplateError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def import_confirm(request):
    text = (request.data or {}).get("template", "")
    if not text.strip():
        return Response(
            {"template": ["No template provided"]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        issue = import_service.create_issue_from_template(text)
        return Response(
            IssueDetailSerializer(issue).data,
            status=status.HTTP_201_CREATED,
        )
    except import_service.TemplateError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def stats_summary(request):
    return Response(stats_service.build_summary())
