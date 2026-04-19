"""Token blacklist store.

Current implementation is in-memory; replace with Redis/DB in multi-instance production.
"""

blacklisted_tokens: set[str] = set()
