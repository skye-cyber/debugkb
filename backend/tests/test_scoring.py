from apps.issues.services.scoring import calculate_priority


def test_priority_bounds():
    assert 0 <= calculate_priority("critical", 10, 10, "confirmed") <= 10
    assert 0 <= calculate_priority("low", 1, 1, "uncertain") <= 10


def test_priority_ordering():
    high = calculate_priority("critical", 9, 9, "confirmed")
    low = calculate_priority("low", 2, 2, "uncertain")
    assert high > low
