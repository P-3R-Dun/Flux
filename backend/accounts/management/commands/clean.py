from django.core.management.base import BaseCommand
from datetime import timedelta
from django.utils import timezone
from accounts.models import User

class Command(BaseCommand):
    help = 'Cleanup users which didn`t activate theirs account for 3 days'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Delete all users regardless of activation status',
        )

    def handle(self, *args, **options):
        if options['all']:
            count, _ = User.objects.all().delete()
            self.stdout.write(self.style.WARNING(f'Deleted ALL {count} users from database'))
        else:
            threshold = timezone.now() - timedelta(days=3)
            count, _ = User.objects.filter(is_active=False, date_joined__lt=threshold).delete()
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} records'))