
# CODE: Privacy Labels for your Google Search results
Extension for the Chrome browser which allows users to "see behind the links" on the Google Search results page.
You're welcome to check out our [technical report](Technical_Report.md) for detailed information about the project.
![title](img/labels_in_action.png)

https://user-images.githubusercontent.com/18154624/134519914-b56c66fc-fe52-48d1-b5d7-6c46959ef316.mp4

```bibtex
@inproceedings{gruenewald2021datensouveränität,
  author    = {Elias Grünewald and Frank Pallas},
  title     = {Datensouveränität für Verbraucher:innen: Technische Ansätze durch KI-basierte Transparenz und Auskunft im Kontext der DSGVO},
  series = {Alexander Boden, Timo Jakobi, Gunnar Stevens, Christian Bala (Hgg.): Verbraucherdatenschutz - Technik und Regulation zur Unterstützung des Individuums},
  isbn      = {978-3-96043-095-7},
  doi       = {10.18418/978-3-96043-095-7\_02},
  url       = {https://nbn-resolving.org/urn:nbn:de:hbz:1044-opus-60219},
  pages     = {1 -- 17},
  year      = {2021},
}
```
See the related publication here (in German): https://pub.h-brs.de/frontdoor/index/index/docId/6021


## Project structure
The directory structure is as follows:
### "develop" branch
* [Database_communication/](https://github.com/DonSimerino/CODE-DaWeSys/tree/develop/Database_communication) for backend code and databases
* [extension/](https://github.com/DonSimerino/CODE-DaWeSys/tree/develop/extension) for extension files
* [img/](https://github.com/DonSimerino/CODE-DaWeSys/tree/develop/img) images and files for this readme and the technical report
### "gcloud" branch
* backend running on the [Google Cloud Server](https://code-dawesys.appspot.com)

## Development setup
Clone this repository:
```git clone https://github.com/DonSimerino/CODE-DaWeSys.git```

You can either run the code locally or on the cloud server. Comment out the not needed lines in `content.js`:
```javascript
251 //xhttp.open("POST", "https://code-dawesys.appspot.com/sendurls/", true); //Google Cloud
252 xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //local
```
```javascript
587 //xhttp.open("POST", "https://code-dawesys.appspot.com/sendurls/", true); //Google Cloud
588 xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //local
```
If you decide to run the project locally, run the `main.py`file.
## Project as Docker
There is a Dockerfile included in the directory `safeBrowsing` . Before building the image, however, you should specify the port in `main.py` at `app.run` as 0.0.0.0 . An example is given in the Dockerfile. 

You can build the image with the following command:
```sh
docker build -t <name> .
```
If successfully built you start the container like this:
```sh
docker run -it --rm -p 5000:5000 --name <name_of_container> <name_of_image>
```

## Install extension
You can add the extension manually to your Chrome browser or download it directly from the [Chrome Web Store](https://chrome.google.com/webstore/detail/cookie-decliner/pfgokjomcikflphieccllalibiejlcde?hl=de&authuser=0).
To add the extension manually:
1. Open Chrome browser, navigate to `chrome://extensions/` and enable `Developer mode`
2. Go to `Load unpacked` and select the `extension` directory
3. You a ready to go: Google something and check out the labels 🟢🟡🔴

## The MIT License (MIT)
Copyright © 2021

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Dependencies
This software depends on the following third party software products:

* [bootstrap](https://github.com/twbs/bootstrap.git) under MIT License
* [webflow css](github.com/necolas/normalize.css) under MIT License
* [flask](https://github.com/pallets/flask.git) under BSD-3-Clause License

![code_logo](img/logos_icons_code.001.png)
