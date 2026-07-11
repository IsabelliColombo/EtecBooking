FROM mongo:7

LABEL org.opencontainers.image.title="etecbooking-mongodb"
LABEL org.opencontainers.image.description="Instância MongoDB para livros e reservas do EtecBooking"

ENV MONGO_INITDB_DATABASE=etecbooking

COPY docker/mongo-init.js /docker-entrypoint-initdb.d/mongo-init.js

EXPOSE 27017

VOLUME ["/data/db"]

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD mongosh --quiet --eval "db.adminCommand('ping').ok" || exit 1
