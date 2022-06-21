# mongo-PII

- A sample GitHub PII file is linked [here](https://github.com/priyansh71/mongo-PII/blob/main/PII.json), where each object has the Primary Key as ```SSN```.

- The Database has two collections ```users``` and ```etags```.

- Whenever an empty ```POST``` request is sent to ```/```, the backend populates the mongo collection with the PII data, and   documents are updated, deleted or created as per the current status of the PII file and the ```etags``` collection is updated with the current Etag value.

     <img width="578" alt="Screenshot 2022-06-21 at 14 04 36" src="https://user-images.githubusercontent.com/77532581/174755287-43f5f66c-2396-4e74-87ca-be2c47738fd7.png">

- If the PII file is the same as the one fetched in the last iteration, and still a ```POST``` request is made, the Etag from the response is checked, and as it would be the same, no changes are made to the ```users``` collection.

     <img width="510" alt="Screenshot 2022-06-21 at 14 05 36" src="https://user-images.githubusercontent.com/77532581/174755396-7d6b057b-d583-425a-8d2d-0aa12d1eb6a6.png">
