"""Seed data for development and testing."""
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from app.models import Surprise
from app.services.surprise_service import generate_token


def create_demo_data(db: Session) -> None:
    """Create sample surprises if the database is empty."""
    existing = db.query(Surprise).count()
    if existing > 0:
        return

    now = datetime.now(timezone.utc)

    cake = "\U0001F382"        # birthday cake emoji
    ring = "\U0001F48D"        # ring emoji
    party = "\U0001F389"       # party popper
    heart = "\u2764\uFE0F"     # red heart

    # 1. Birthday surprise unlocking 2 minutes from now (easy testing)
    demo_quick = Surprise(
        public_token=generate_token(),
        recipient_name="Ananya",
        title="A Little Something For You",
        creator_name="Yaswanth",
        occasion="birthday",
        occasion_icon=cake,
        greeting="Something special is waiting for you...",
        message=(
            f"Happy Birthday, Ananya! {cake}\n\n"
            "I wanted to create something truly special for your birthday this year. "
            "You are one of the most incredible people I know, and every moment spent with you is a gift.\n\n"
            "You light up every room you walk into, and your smile makes the world a better place. "
            "Here's to another amazing year of adventures, laughter, and beautiful memories together.\n\n"
            "Wishing you all the happiness in the world today and always!\n\n"
            f"With love,\nYaswanth {heart}"
        ),
        unlock_at=now + timedelta(minutes=2),
        timezone="Asia/Kolkata",
        theme="birthday",
        box_style="classic",
    )

    # 2. Birthday surprise for future date
    demo_future = Surprise(
        public_token=generate_token(),
        recipient_name="Ananya",
        title="Birthday Surprise 2026",
        creator_name="Yaswanth",
        occasion="birthday",
        occasion_icon=cake,
        greeting="Mark your calendar... something magical is coming!",
        message=f"This is a future birthday surprise message! If you're reading this, the unlock worked perfectly. Happy Birthday! {party}",
        unlock_at=datetime(2026, 9, 12, 0, 0, 0, tzinfo=timezone.utc),
        timezone="Asia/Kolkata",
        theme="birthday",
        box_style="classic",
    )

    # 3. Anniversary surprise already unlocked (past date)
    demo_unlocked = Surprise(
        public_token=generate_token(),
        recipient_name="Priya",
        title="Happy Anniversary, My Love",
        creator_name="Rahul",
        occasion="anniversary",
        occasion_icon=ring,
        greeting="A year of beautiful moments...",
        message=(
            f"Happy Anniversary, Priya! {ring}\n\n"
            "One year ago, our journey together began, and every single day has been more beautiful than the last. "
            "You are my best friend, my partner, and my everything.\n\n"
            "Here's to a lifetime of love, laughter, and adventure together.\n\n"
            "I love you more than words can say.\n\n"
            f"Forever yours,\nRahul {heart}"
        ),
        unlock_at=now - timedelta(hours=1),
        timezone="Asia/Kolkata",
        theme="elegant",
        box_style="classic",
        is_opened=True,
    )

    db.add_all([demo_quick, demo_future, demo_unlocked])
    db.commit()

    print(f"\n{'='*60}")
    print("  DEMO DATA CREATED")
    print(f"{'='*60}")
    print(f"  Quick test (unlocks in 2 min): /s/{demo_quick.public_token}")
    print(f"  Future (Sept 12, 2026):        /s/{demo_future.public_token}")
    print(f"  Already unlocked:              /s/{demo_unlocked.public_token}")
    print(f"{'='*60}\n")
