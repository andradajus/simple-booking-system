from django.db import models
from django.utils.translation import pgettext_lazy
from django.utils.timezone import now


class Module(models.Model):
    name = models.CharField(
        pgettext_lazy('Module field', 'name'),
        unique=True,
        max_length=128
    )
    description = models.TextField(
        pgettext_lazy('Module Field', 'description'),
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(
        pgettext_lazy('Module field', 'created at'),
        default=now,
        editable=False
    )
    updated_at = models.DateTimeField(
        pgettext_lazy('Module field', 'updated at'),
        default=now
    )

    class Meta:
        app_label = 'module'

    def __str__(self):
        return self.name

class Room(models.Model):
    ROOM_TYPE_CHOICES = (
        ('room', 'Room'),
        ('tent', 'Tent'),
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=ROOM_TYPE_CHOICES)
    max_capacity = models.PositiveIntegerField()

    def __str__(self):
        return "{} ({})".format(self.name, self.get_type_display())
