## Backend Setup
1. Clone this repository
2. Navigate to the `backend` directory.
3. Create a virutal environment : `python -m venv venv`.
4. Start the virtual environment: `venv\Scripts\activate`.
5. Install the required packages : `pip install -r requirements.txt`.
6. Run `python manage.py makemigrations`.
7. Run `python manage.py migrate`.
8. Create a superuser: `python manage.py createsuperuser`
9. Run the server: `python manage.py runserver`.

## Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies : `yarn install`.
3. Run the server: `yarn start`.
