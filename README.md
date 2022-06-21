# mongo-PII

- A sample PII file is [here](https://raw.githubusercontent.com/priyansh71/mongo-PII/main/PII.json?token=GHSAT0AAAAAABMBBCY35SJ4VNP25A3PIRFCYVRREYA), where each object has the Primary Key as ```SSN```.

- The Database has two collections ```users``` and ```etags```.

- Whenever an empty ```POST``` request is sent to ```/```, the backend populates the mongo collection with the PII data, and   documents are updated, deleted or created as per the current status of the PII file and the ```etags``` collection is updated with the current Etag value.

- If the PII file is the same as the one fetched in the last iteration, and still a ```POST``` request is made, the Etag from the response is checked, and as it would be the same, no changes are made to the ```users``` collection.
