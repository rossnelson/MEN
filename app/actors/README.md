# Actors

Actors are a presentational class. Their purpose should never be to persist
data. But rather, they should only process data and return the altered result.

An example my be, parsing sensitive data out of a mongo record or joining two
result sets based on predetermined business logic.
