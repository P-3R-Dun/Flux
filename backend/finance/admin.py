from django.contrib import admin

from django.contrib import admin
from .models import UserProfile, Category, Goal, Transaction

admin.site.register(UserProfile)
admin.site.register(Category)
admin.site.register(Goal)
admin.site.register(Transaction)