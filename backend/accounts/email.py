from djoser import email
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


class PasswordResetEmail(email.PasswordResetEmail):
    template_name = 'email/password_reset.html'

    def get_subject(self):
        return f"Відновлення паролю | {settings.DJOSER.get('SITE_NAME', 'Flux')}"

    def get_context_data(self):
        context = super().get_context_data()
        context['domain'] = settings.DJOSER.get('DOMAIN')
        context['site_name'] = settings.DJOSER.get('SITE_NAME')
        context['protocol'] = 'http'
        return context

    def send(self, to, *args, **kwargs):
        context = self.get_context_data()
        html_content = render_to_string(self.template_name, context)

        subject = self.get_subject()
        from_email = f"Flux Service <{settings.EMAIL_HOST_USER}>"

        msg = EmailMultiAlternatives(subject, "Используйте HTML-клиент", from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
