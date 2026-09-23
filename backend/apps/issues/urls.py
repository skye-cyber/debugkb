from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"issues", views.IssueViewSet, basename="issue")
router.register(r"tags", views.TagViewSet, basename="tag")
router.register(r"skills", views.SkillViewSet, basename="skill")

urlpatterns = [
    path("", include(router.urls)),
    path("search/", views.search_view, name="search"),
    path("import/preview/", views.import_preview, name="import-preview"),
    path("import/confirm/", views.import_confirm, name="import-confirm"),
    path("stats/summary/", views.stats_summary, name="stats-summary"),
]
