from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404


def mvp_index(request):
    """Serves the MVP frontend (static HTML) from Django."""
    base_dir = Path(settings.BASE_DIR)
    index_path = base_dir / 'frontend_mvp' / 'index.html'
    if not index_path.exists():
        raise Http404('MVP index.html no encontrado')
    return FileResponse(open(index_path, 'rb'), content_type='text/html; charset=utf-8')

