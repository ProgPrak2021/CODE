# IMPORTANT: Before building the image you have to add the port 0.0.0.0 in main.py:
# e.g app.run(debug=True, host='0.0.0.0') instead of app.run(debug=True)
# start from base
FROM python:rc-slim-buster

LABEL maintainer="Moritz Schelten <m.schelten@posteo.de>"
# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
COPY . /app
CMD [ "python", "./main.py" ]