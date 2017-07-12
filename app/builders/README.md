# Builders

Builders are meant for any data update and persistence management that requires
more then a single operation.

For example, a TeamBuilder may create multiple records on both an remote API and
within the local database. The Builder will encapsulate that process and give it
a clean reusable interface.
