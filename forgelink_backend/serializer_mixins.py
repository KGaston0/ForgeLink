class OwnerScopedRelatedFieldsMixin:
    """
    Restrict related-object fields to objects owned by the requesting user.

    Without this, a ModelSerializer accepts any primary key for a ForeignKey, so a
    user could attach their data to (or read through) another user's project, graph,
    node or blueprint just by guessing an id.

    Set ``owner_scoped_fields`` to map each field name to the ORM lookup that leads
    to the owning user, e.g. ``{'project': 'owner', 'node': 'project__owner'}``.
    Without an authenticated request the field accepts nothing.
    """

    owner_scoped_fields = {}

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        authenticated = bool(user and user.is_authenticated)

        for name, lookup in self.owner_scoped_fields.items():
            field = fields.get(name)
            if field is None:
                continue
            # many=True fields wrap the real field in ``child_relation``
            relation = getattr(field, 'child_relation', field)
            queryset = getattr(relation, 'queryset', None)
            if queryset is None:
                continue
            relation.queryset = (
                queryset.filter(**{lookup: user}) if authenticated else queryset.none()
            )
        return fields
