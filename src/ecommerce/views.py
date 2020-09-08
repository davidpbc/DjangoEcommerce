from django.contrib.auth import authenticate, login, get_user_model
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

from .forms import ContactForm


def home_page(request):
    context = {
        "title": "Hello World!",
        "content": "Welcome to the Home Page.",
    }
    if request.user.is_authenticated():
        context["premium_content"] = "Yeah!"
    return render(request, "home_page.html", context)

def about_page(request):
    context = {
        "title": "About Page",
        "content": "Welcome to the About Page.",
    }
    return render(request, "home_page.html", context)

def contact_page(request):
    contact_form = ContactForm(request.POST or None)
    context = {
        "title": "Contact",
        "content": "Welcome to the Contact Page.",
        "form": contact_form,
    }

    if contact_form.is_valid():
        print(contact_form.cleaned_data)
        if request.is_ajax():
            return JsonResponse({"message": "Thank You"})

    if contact_form.errors and request.is_ajax():
        errors = contact_form.errors.as_json()
        return HttpResponse(errors, status=400, content_type="application/json")

    return render(request, "contact/view.html", context)


