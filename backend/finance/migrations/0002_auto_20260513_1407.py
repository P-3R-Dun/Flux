from django.db import migrations

def create_default_categories(apps, schema_editor):
    Category = apps.get_model('finance', 'Category')

    default_categories = [
        Category(id=1, name="Groceries", type="expense", icon_name="ShoppingCart", is_default=True),
        Category(id=2, name="Dining Out", type="expense", icon_name="Coffee", is_default=True),
        Category(id=3, name="Housing & Utilities", type="expense", icon_name="Building2", is_default=True),
        Category(id=4, name="Transportation", type="expense", icon_name="Van", is_default=True),
        Category(id=5, name="Health & Medical", type="expense", icon_name="ScanHeart", is_default=True),
        Category(id=6, name="Subscriptions & Services", type="expense", icon_name="Pointer", is_default=True),
        Category(id=7, name="Shopping & Personal Care", type="expense", icon_name="Handbag", is_default=True),
        Category(id=8, name="Entertainment & Hobbies", type="expense", icon_name="Gamepad2", is_default=True),
        Category(id=9, name="Other", type="expense", icon_name="Ellipsis", is_default=True),
        Category(id=10, name="Salary", type="income", icon_name="CircleDollarSign", is_default=True),
        Category(id=11, name="Freelance", type="income", icon_name="Coins", is_default=True),
        Category(id=12, name="Investments", type="income", icon_name="Bitcoin", is_default=True),
        Category(id=13, name="Rental Income", type="income", icon_name="HousePlus", is_default=True),
        Category(id=14, name="Cashback", type="income", icon_name="BanknoteArrowDown", is_default=True),
        Category(id=15, name="Gifts", type="income", icon_name="Gift", is_default=True),
        Category(id=16, name="Benefits", type="income", icon_name="Landmark", is_default=True),
        Category(id=17, name="Business Profit", type="income", icon_name="BriefcaseBusiness", is_default=True),
        Category(id=18, name="Other", type="income", icon_name="Ellipsis", is_default=True),
    ]
    Category.objects.bulk_create(default_categories)


def remove_default_categories(apps, schema_editor):
    Category = apps.get_model('finance', 'Category')
    Category.objects.filter(id__in=range(1, 19)).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('finance', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_categories, remove_default_categories),
    ]