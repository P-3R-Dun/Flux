from djoser import email
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

class Mailer:
    @staticmethod
    def send_html_email(subject, template_name, context, to_email):
        context.update({
            'domain': settings.DJOSER.get('DOMAIN'),
            'site_name': settings.DJOSER.get('SITE_NAME', 'Flux'),
            'protocol': 'http',
        })

        html_content = render_to_string(template_name, context)
        from_email = f"Flux Service <{settings.EMAIL_HOST_USER}>"

        msg = EmailMultiAlternatives(
            subject=f"{subject} | {context['site_name']}",
            body="Будь ласка, використовуйте HTML-сумісний клієнт.",
            from_email=from_email,
            to=[to_email] if isinstance(to_email, str) else to_email
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

class ActivationEmail(email.ActivationEmail):
    template_name = 'email/activation.html'

    def send(self, to, *args, **kwargs):
        context = self.get_context_data()
        Mailer.send_html_email(
            subject="Активація акаунту",
            template_name=self.template_name,
            context=context,
            to_email=to
        )

class PasswordResetEmail(email.PasswordResetEmail):
    template_name = 'email/password_reset.html'

    def send(self, to, *args, **kwargs):
        context = self.get_context_data()

        Mailer.send_html_email(
            subject="Відновлення паролю",
            template_name=self.template_name,
            context=context,
            to_email=to
        )