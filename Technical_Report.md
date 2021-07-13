# CODE - one Plug-In for more Privacy
### Technical Report | DaWeSys | Summer'21

![Title_image](https://images.unsplash.com/photo-1498049860654-af1a5c566876?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2550&q=80)

## About CODE
CODE is a browser extension for the Chrome-Browser. It allows users to get a quick overview about the information website track before they even open the website. With small labels next to the search results in Google they can easily decide whether to open a website or not.

## Functionality
Let's summarize the core functionality features of the extension.
### Extension (TO DO)
Lorem ipsum...
### Algorithm (TO DO)
Lorem ipsum...
### Expert Mode (TO DO) Ali
Lorem impsum...

## Design
### Labels
CODE-Labels are designed to give users privacy information about websites real quick. With a **simple comprehensible design** users easily understand its meaning.

There are three labels: **green, yellow and red**. User will see the green one if the website is considered highly privacy sensitive and does not track their personal information. The yellow one appears, when there are some concerns about the website, which are not considered totally trustworthy. Lastly, there are red labels for websites, which are considered as not privacy sensitive or bare a risk for the user e.g. malicious software.

No matter which label appears, users always can **hover over the label** to see more information about it. Users will find the amount of trackers found on the page as well as some icons for the popular ones like the ones by Google or Facebook. This way users are more likely to understand how the label "got it color".

### Privacy Summary (Homepage / New Tab)
There are some design features on the Homepage which are worth mentioning. The Homepage appears on the New Tab in the browser and contains three main fields. The first and most present one is a number - **privacy score**. The privacy score summarizes the labels of the website visited by the user. It counts the green and golden labels among the visited websites and relates this number to labels from all visited labels. This way user can easily see how thier surfing behaviour was. For example: Assuming user sees a 75%. It means, that over all visited websites 75 percent had a green label. That's pretty awesome! Users can also reset the score, if wanted.

There are two more fields: an overview about recently calculated labels and a form to create a new label for a website. Both are used to **increase user interaction** with the extension. With creating new labels, users can easily calculate labels for websites they are most interested in. And with the history of recently created labels users can track the dynamic nature of the extension and easily have a brief look at the results.

Since the Homepage summarizes the core functionality of the extension and informs users about it, it is simply called: **Privacy Summary**.

## Technical Details in a Nutshell
### Data sources (TO DO)
**Whotracks.me:** This database is part of an open-source project. It was created using the Cliqz browser and extension, and the chrome's Ghostery extension, whose main objective is to block and protect users from tracking. It includes more than 6,000 of the most popular websites and it includes detailed information the following elements: 
 * Categories
 * Companies 
 * Domains
 * Trackers
 * Sites
Similarly, it has statistics from each domain, for example: 
 * Average number of requests made to the tracker per page
 * Proportion of pages where a unique identifier (UID) was detected in the query string parameters sent with a request to this tracker.
 * Proportion of pages where the tracker only used HTTPS traffic
 * Average number of requests made to the tracker with tracking (cookie or query string) per page
On top of that, this database is being updated every month. Whic is a very important factor for us, because they information is the one we display in our pop up when hovering the CODE-label of a website.
We put a great value in this database, because it is not only the most complete one, but it is also been used as based database fo rother projects like... ?  

 Website: https://www.whotracks.me 
 Based on: https://arxiv.org/abs/1804.08959 


**Phishstats:**It is a real time Phishing database that gathers phishing URLs from several sources. It started in 2014, and it has now a Database with over 3 million records. Its free API is however very slow, and did not meet our requirements. Luckily enough, they also let us download from their webpage a csv file, that is being updated every 90 minutes, with phishing URLs from the past 30 days.
For each domain, it has the following information: 
* IP
* Score. 1 - 10. Being 10 the highest Phishing risk.
* URL
* Date
Website: https://phishstats.info/ 

**PrivacySpy:**To continue the line of open source projects devoted to privacy, we have now the PrivacySpy project. 
The creators are devoted to the "Privacy Matters"-Philosophy, and this is why they compiled a list of the most used websites worldwide. And they have assigned a score to each one of them. Score is again 0-10. This time is 10 the website with the best positive result.
In order to calculate the score, they use following criterias: 
* Data Handling, for example:
  * Does the policy allow personally-targeted or behavioral marketing? 
  * Does the service allow third-party access to private personal data?
* Transparency, for example: 
  * For example: Does the policy require users to be notified in case of a data breach? 
  * Is the policy's history made available? 
* Collection, for example:
  * Is it clear why the service collects the personal data that it does? 
  * Does the policy list the personal data it collects? 

Finally, they allow the public to download the data, which made it easier for us to integrate it to our server. Even though the database is not as big as previous data sources, it puts a great amount of work in calculating the scores. this is why we decided to include it in our label calculation. 

Website: https://privacyspy.org/ 
### APIs (TO DO)
(Are we actually using the google safe api?)
**Google Safe Browsing API:** Safe Browsing is a Google service that contains a lists of unsafe web resources, which Google also keeps up to date. Examples of unsafe web resources are social engineering sites (phishing and deceptive sites) and sites that host malware or unwanted software. 
Website: https://developers.google.com/safe-browsing 
## Overview (TO DO)
### Chances & Concerns (TO DO)
