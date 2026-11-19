# Wall of Portfolios: the Creative wall, studied in a browser

Date: 2026-11-16. Method: `docs/v3/rubric.md`. Headless Chrome (Playwright) at 1440 x 900 and 390 x 844. Busyness from `metrics.py` on unique 1440 stills (calm and busy are % of the screen; hues is the number of colour families; sat and lum are medians 0 to 100). Motion from 12-frame load captures, 10-step scroll captures at 3 depths, hover strips at 0 / 100 / 400 / 1200 ms, and two idle frames 1.5 s apart. Nothing was submitted, no account was used, no bot check was touched.

## Step 1: what the wall really lists

- **221 Creative portfolios.** The wall page does not scroll the window; it scrolls inside a container (`div.app-main-wrap`), which is why a quick look only shows 9 cards. Scrolling that container loads 9 more cards at a time from `GET /filter-portfolios/?company=All&style=creative&page=N`. Pages 1 to 25 hold 221 unique sites (page 25 is partial; later page numbers repeat earlier results). The count matches the "See 221 Results" button in the filter panel.
- **No pagination and no 'load more' button**: only infinite scroll. Each card links to a profile page at `/portfolio/<slug>`, which shows the site in an iframe; the real site URL is the iframe `src`.
- **Login wall**: the list and the profile pages are open. The Designation, Experience and Country filters open a "Log In Or Sign Up To Continue" modal (Google or email), so those filters were not used. The company chips (Microsoft, Google, Amazon...) and the "Open To Work Only" toggle are open but narrow the list rather than add to it.
- **What the wall says 'creative' means**: "Explore a curated collection of creative portfolio websites featuring experimental layouts, bold typography, striking visuals, and interactive experiences. Discover how product, visual, and UI/UX designers use storytelling and distinctive design styles to showcase their work." In practice the Creative tag covers anything that is not a plain product-designer template: illustrated or 3D worlds, collage, games, desk or room metaphors, loud colour, giant type.
- **What the 221 look like** (from contact sheets of every thumbnail, not counted precisely): mostly giant-type heroes with a photo or 3D object, light or dark; then loud colour posters, collages, games and desktop metaphors. 12 of the 221 were marked as painted, illustrated, 3D or game worlds close to Lana's brief (listed below).

### Footer category pages

| Category (style key) | Sites | Also in Creative | Wall's own description |
|---|---|---|---|
| Interactive (`interactive-design-portfolios`) | 352 | 6 | animations, motion design and creative interactions; engaging transitions; visual storytelling |
| Dark Themed (`dark-theme`) | 420 | 5 | black backgrounds, bold typography, striking visuals |
| Modern Layout (`modern-layouts`) | 91 | 3 | bento grid portfolios, modular layouts |
| Minimalist (`minimal`) | 540 | 0 | clean layouts, thoughtful typography, whitespace |

Together the four pages add 1368 sites that are not on the Creative wall.

- **Interactive** is the only category close to Lana's taste. It holds most of the painted and pixel scenes outside Creative: Shashank Khambhaita (pixel-art room with a purple jacaranda window), Oorja Kapoor (painted sunset and a mountain trail you climb by scrolling), Madhur Rastogi (painted anime valley), plus Amulya Agarwal, Lehar Sindra and Shubhank Vyas (illustrated hero scenes).
- **Dark Themed** is almost entirely dark product-designer pages (dark grey ground, white grotesk, screenshots). Two exceptions have mood: Yuki C (night gradient with small type) and Vikram Venkatesh (dark scene with a glowing object). Neither is a world.
- **Modern Layout** is bento grids of rounded tiles. Nothing near the brief.
- **Minimalist** (540 sites) was not scanned visually; by its own description it is the opposite of the brief.
- **Extras picked for step 2**: Shashank Khambhaita, Oorja Kapoor and Madhur Rastogi (all from Interactive).

**Creative sites nearest Lana's taste** (painted or illustrated worlds, objects as interface, purple or night, travel on scroll): Vibhor Mathur (walkable 3D island), Natania Doshi (purple illustrated garden), Himanshu Shakit (3D room with a window and a Night mode), Failenn Aselta (collage island with purple accents and clickable objects), Arshvardhan Bishnoi (night pixel game). Also noted but not studied: Bhaskar Taye, Kaustubh Barhate, Rohith Manikkoth, Manisha Koranga, Akhilesh Parab, Nishtha Rikhi, Sagar Patil.

<details><summary>All 221 names on Creative</summary>

Rezwanul Choudhury, Royden So, Adya Srivastava, loveleen pereira, Sahil Betigeri, Rolan Gomes, Harshini P Rajan, Shalmali Gaikwad, Sudarvel K, Darshita Patankar, Vanshika Rawat, Siddhartha kumar, Bhaskar Taye, Shyam Kandu, Samudra Gupta, Arya Leday, Chi Quach, Adithya Satheesh, Vibhor Mathur, Leo Fu, Shelby Kho, Nayanika Chatterjee, James Chugh, Yutika Pahuja, Kanishk Patel, Frances Zhao, Arshvardhan Bishnoi, Eemon Roy, Nonisha Negi, Manisha Koranga, Om Karandikar, Dhruval Mayavanshi, Diwyani Vajpayee, Sahor Debbarma, Abhijit R, Sarthak Tiwari, Ayush Dhibar, Akriti Purbey, Tony Sebastian, Sanket Ghongade, Harssha vardan, hrishi kumar, Rishabh Pandey, KATYAYANI KUSUMA, Akshat Srivastava, Surabhi Kishor, Aryan Tripathi, Annanya Gopakumar, Gowtham Ganesan, Diodona Maenggartama, Shruti Sonali, Lavanya Saharan, Sruthi Ramisetty, Riya das, Natalie Almosa, Kateryna Kravchenko, Sreelal Bhaskaran, Spencer Gabor, Kriti Chauhan, Ayush Halder, Aanchal Maratha, Siddharth Tewary, Himanshu Shakit, Additti, Lauren Blake, Ryan Walter, Ilnaz Khasanshin, lavanya, Akhilesh Parab, Disha Sharma, Mansi Chauhan, Subham Maharana, sudharsan sarathi, Ganesh Bansod, sitra, Shreya Sama, Anirban Ganguli, Krishnachandran, Maitreyee kalaskar, Kamalika Basu, Manali Gupta, Arul G Bershin, Ved Uttam, Vidushi Singh, Natania doshi, Himani Bindal, Freya Vora, ananya zharotia, Suhail Khan, Raj Shripad, Nishtha Rikhi, Komal Sriram, Ajith chandran, Steve Salgado, Jinesh Bhaskaran, Gi Calves, Ranita Ranjan, Pulkit Dube Bagchi, Tanya Singh, Prerna Athia, Anushree Nakhre, Nitish Kannan, Charlie Kohn, Prithiviraj Elango, Jake Sharpe, Failenn Aselta, João Ferreira, Sauhardya Sengupta, Aayati Ramesh, Nived Prem, Rutuja Shelke, Veronica Loza, Anoushna Nandi, satish hebbal, Mahi Shah, Evangeline Ng, Yan Liu, Bruno Peviani, Kirti Neeraj, ananya shajeev, Avika Gupta, Vridhi R, Ajita Gupta, Nahiyan Khan, Suryansh Vishwakarma, Ameya Honkalaskar, Aryan Nalwa, Abhiram Thumbarathy, Md Shaheer Ahmed, Gautami Duvve, Bhanuprasad raspallawar, Roman Serebryakov, Lara Guerreiro, Yash Gadikar, Harman Bhatia, Ysabella Nicole Alvarez, Rohit Paranjape, Alba Ferguti, Akarshita Chandra, Tarang Vishwakarma, Sun Hung, Kaustubh Barhate, Paavni Bhojwani, Sagar Patil, Vanya Issar, Steven Acres, Nikhil Mohan, Anshuman Jha, Balint Horvath, Prajwal Kunjir, Prithvi C., Anesh Kangutkar, Mihika Lagwankar, Samruddhi Mahajan, Michael Bernard, Annet Babu, Aaron Sananes, Arshad Riyas, Aditya Mandle, Inika Jhamvar, Saagar Srivastava, Elaine Yu, Nivedha Nirmal, Praveena Venkatesan, Charmaine Sah, Vignesh N, Hongqian Li, You Zhang, Chloé Chazal, Niyas V, Emily Nagy, Mehul Paul, Alric Monteiro, Kumar R, omar eid, Ayush Arora, Palash Khandelwal, Sushobhan Parida, Arsen Kolyba, Apurva Savadi, Albert Chang, Vince Lin, Milan Verma, Manolo Bevia, Sagar Bhat, Igor Mahr, Rohith Manikkoth, Kaitlin Chow, Bethany Robertson, hyning gan, Mridibha Tiwari, Saiyam Marwah, Yuli M, Aayushi Nagar, Falguni Rathore, Mukund Choudhary, Pragya Goenka, Abhishek Jha, JANVI GULIYAN, Sidharth Singh, Siddharth Hardikar, Noble Babu, Meet Vora, Siddhant giri, Neelesh Thakur, Prathik sindham, Aboubaker Mdidech, Charmin Kumar Vemula, Srushti Hasabe, Shweta Pawar, Akhilesh S, Parth Jhawar, Sherlyn T, Jon Hanlan, Devadhathan MD, lipi chopra, Adhithyan GS, J Dillon, Sourav Kumar, Damini Bhardwaj, nourhan elnooby

</details>

<details><summary>All 352 names on Interactive</summary>

Shai Krishna, Urjasi Dutta, Jai Tekchandani, M Pranav, Dhiraj chouhan, Konica Gupta, Sneha Jain, Mrunal Dhaygude, Julia Rouxinol, Shivam Kumar, Smriti Rawat, Shrea George, Rebecca, Shashank Khambhaita, Amulya Agarwal, Ashwinikumar Gupta, Poorvi Singh, Shabnam, Oorja Kapoor, Cherry Hu, Pranshu Agarwal, khushi jain, Simon Thai, Mridul Narnaulia, Samay, Gahan Rao, anima Jain, Kabir Shrivastava, Neelesh Thakur, Harpreet Jaggi, akshitha venkat, Aaron Carvalho, Neha Yadav, Arnob Mukherjee, Val Nogues, Ben Shih, Gurudutt Perichetla, McLane Teitel, Tee Hodgson, Anirudh Palaskar, Siddharth Kumar, Dev Ashish Dewangan, Kailash B, Adyatha Bhat, Kumar Avineesh, Agnieszka Grabowicz, Aman Kumar, Muskaan Gupta, Sanjay Menon, Yash Kelzare, Rishika Gupta, Yash Fataniya, Ritam Biswas, Yim Cheung Chan, Aakash Goel, Prasannadeep Das, Keerthi, Pavlo Sydorenko, Abhiram V M, Vrinda, Sarthak joshi, Ritik Goyal, Shannon Sauhee Han, Ashish Ranjan, Shruti, Anoushka Shresth, Aashish Methani, Akshit Manik, Kshitij Kumar, Mauro Berteri, Prabhu, Abhyuday Chandravanshi, Katarina Blind, Gurmeet singh, Aditya Krishnan, Shreya Agrawal, tejasri panchumarthy, Nandini Chowdhary, Aditya Sadhukhan, Gokul R, Zainab Kabira, Aarya Vaidya, Jagdish Moundekar, Jason Spidle, Shreyas Vyas, Aanchal Dua, Santrupti P, Rajat Berry, Tanvi Gera, Dean (Ira) Boschetti, Abdulqahar Usman, Peter Umeh, Michelle Chen, reem, Vardhanika Jagtap, Loveya, Ruchikaa Sahu, Tanisha Kaura, Nikita Saner, Parul Aggarwal, Ashish Kumar Mishra, Joanna Szymendera, Ishant Periwal, Sayandeep Bose, Ashutosh M, Phil Cook, sahil sethiya, Debsourabh Ghosh, Rishabh Yadav, Antony Raphy, Anmol Maggon, Harshal Bankar, Rhythm Kumar, Santhosh Rajendran, Dikshita Basu, Ari haran, Kena Tatamiya, Param Jain, Sonam, Vedant Kore, Abhiram Venugopal, Vivek, Sai Siddartha Maram, Charn Phivnil, Dhriti Kothari, Disha Singh Arora, Maxim Barrel, Roman Sazonov, Hemang Wason, Anushka Shinde, Piyush Jain, Jay Kadam, Azhim Firdaus, Shubhi Agarwal, Nithin M Warrier, sudhanshu, Ayodele Owoetoni, Meghna Ganguly, Harini Senthil kumar, Kanishka Goyal, Siddhant Deshpande, Urvee Patil, Jay Suthar, Ananya gupta, Sierra Hopkins, Rishi Mudaliar, shushan reya, Eugene Serpokrylov, Shubham Bhardwaj, Shubhank Vyas, Nitin Sangwan, Megan Yap, Nina Le, Vasiliy Kiselev, David Kuo, Yash Gehloth, Florencia Lorea, Bruno Cisco, Hana Kabeer, Sandhya Siddarth, Utkarsh raj, Priyanka, Pradeep Yellapu, Ahkshara Sankar, Mugdha Agrawal, Ayush Kumar, Alex Nguyen, Ananya, Viha Shah, Kirtanya kardum, Anushna Shri Vetri, Annapurna S, John Hanacek, Riya Mahajan, Anuja Lokhande, Paarth Kondekar, Burak Canpolat, Justin Kim, Anshika vijay, Muhammed Suhail, Luis Miguel Malubay, Osvita Cardozo, Shreya Ramesh, Saraswathy P, Sanaz Ghasemipour, Masha Chubina, Andrea Da Silva, Christine Chow, Shantanu Gothankar, Aryan Yadav, Pragathi H, Sasha Lazarev, Athul krishna, Diya Patel, Robin Rotman, Hiloni Shah, krishna dutt, Bhavya Dharmani, Jhanvi Bhatia, Mridul Soni, ojas raj, Rajdeep Sarkar, Sahil Chaudhari, Shreyas Patil, Devagya Sharma, Maria Vareva, Riddhiman Paul, Rohit Warrier, Jayant Sharma, akshaya gopalkrishna, Ruslan Tsytsiura, Arjun Raghavan, Manasvi Joshi, Alexander af Ekenstam, Manasi Ghutukade, Shrushti Patel, Carl Kurtz, Ankur Dwivedi, Noa Abad Gracia, Sanjay Meena, Simran Preet Singh, Vergil Ebong, Navami Nataraj, Komal Deo, Bruce Cao, Sandesh KN, Shrey Sharma, Akshay L Shetty, Jay Hari, Lakshita Jaiswal, Divyansh Pareek, Arpit Sangrai, Himesh Mehta, Seth Lukin, Shailesh Pratap Singh, Rohan Shah, Prateek Bhai Patel, Roman Chekurov, Sahil Arora, irfan khan, Rushabh Gouda, Flor Damico, Vishnu Roy, Zui Chen, Tanuja Shastri, Harsh Vasa, Gabriel Misquitta, Prakriti Jain, Swaraj Singh, Deepti Sharma, Chandu Machineni, Robin Mehra, Nachiket Sahare, Atharva Wagh, Gayatri Kalra, maitri patel, Suraj Kandlakunta, Claudius, Vaibhav Singhania, Florence Libbrecht, Akansha Soni, You Zhang, Alwan Thio Hartoyo, Sagnick Dutta, Hitarthi Bhinde, Saul Escobar, Ekpendu Chimezie, Ayush Gupta, Abhay Singh, Om Prakash, Richmond Agbavor, Liya Safina, Manish Sethi, Enrico Joe Soputra, Chidubem Chinwuko, Miloni Vora, Hitesh Lakhyani, Yash Pathak, Kevin Keen, Madhur, Bhavya Thakkar, Pearl plaha, Yashika Chhabaria, Shakeel Mohamed, Jai Vignesh, Harshit Agarwal, Naman Kumar, Balakumar E, Alisha Saini, Abraham Gomez, Sujit K Sen, Hamza Iqbal, Farzad Kafaei, Rahul Singh, Angelo Arcilla, Priya Bhatt, Priyanshu Gupta, Namrata Das, Neelakshi Das, Joel Mihavel, Rashi Mishra, Mukul Kaushik, Bhargav Sai Ram Kattunga, Saiyam Marwah, Rachit Dhoundiyal, Yuli M, Shravani Vadapurkar, Uttkarsh Mandaknale, Neeharika K, Nabhi Shah, Amir Mohammadi, Anuj Vishwakarma, Zeeshan Shaikh, Pranjal Chavan, Nick Mueller, Mayur Chettiar, Vimarsh Tiwari, Rohith Palottil, Chinmay Ghosalkar, Priyadharshini Sivakumar, Siddharth Hardikar, Arpit Chandak, Khushi Rustagi, Gunal M, Khushbu Mandliya, Lehar Sindra, Anand Chauhan, Siddhant giri, Dhanesh Verma, Sharmishtha Dwivedi, Diksha Yadav, Gaurav Sharma, Zeel Shukla, Shengjie Wu, Danny George Oommen, Sonu Mehta, Akash Umang, Prabhav Singh, Florent CLANET, Vaishnavi D, Harshini Satish, Aashish dev raju, Ayushi Korde, Mowa Otun, Keisam Sandeep, Namrata Mandal, Namrata Jaiswal, Harshita Dandu, Shantanu Jha, Nishkarsh Gupta, Tirthraj Rathod, Ranga Balaraman

</details>

<details><summary>All 420 names on Dark Themed</summary>

Jon Willington, Jakub Zegzulka, Sparsh Paliwal, Vaibhav Aggarwal, Sakshi, Dharmesh Nayak, Darshita Patankar, Subarshni N, Durva Gaikwad, Kaushik Murali, Sandeep Baral, Rhiddhit Paul, Naman Bhatia, Siddhant Yadav, Apoorv Gupta, Kalpesh Bhavsar, Hardik Agarwal, Niklas Peterson, Oleg Kukharuk, Arun Kumar R S, Sidharth Sabu, Sam Mei, Evan Yudistira, Amandeep Singh, Rohan Singh, srikesh sundaresan, Abhinav Srivatsa, Anushka Mehta, Ritik Singh, akash soti, Harshit Sharma, Rashmi saini, Awais Razzaque, Neelesh Chaudhary, Megha Sharma, Abhishek Tomar, Ipsita Bajpai, Savan Makadiya, Denisha Ved, Shruti Unnikrishnan, Manish Murgod, Ayaneshu Bhardwaj, Shweta Yadav, Sriya Ventrapragada, Sankalp Sinha, Adarsh Singh, Harrison Wheeler, Nikhil D S, Christeena Thomas, Arslan, Khaled Batt, Rama Krushna Behera, Aarna Jain, Asha Das, Michael Kwok, kailas, Ashish Jain, Vsevolod Kudryavtsev, Vidit Singhal, Anukul Gurung, Bhhavesh Desalhey, Savita Singh, Yuki C, Harin Nitisvaar, Natalie Almosa, Rhea Hinger, Ishaan Kumar, Vikram Venkatesh, Tamanna Mundhra, Rahul Karnekar, Kriti Chauhan, Anuja kumari, Priyanka R, Aakriti Ahuja, Sonal Solaskar, Harsha Bardhan, Sergey Zorin, Sundar Raj Selvanathan, Atharv Damle, Charles Zhang, Karan Thakur, Piyush Kulkarni, Devyani Bhati, Chaepin Kim, Rafael Cespedes, aditi dwivedi, HARSH WARRIER, Bhavarth Bhati, Jassica Jassal, Manasa Rao, Joy Sengupta, Divesh Borse, Tobias Ecsedy, Kousik Dutta, Prakash KJ, Veniamin Vekk, Manya Srivastava, sharath s.p, Aryan Sahu, Subin Sundaresan, gowrish, Kai Nair, Sachin Bhosle, Nika Teiler, Rajeev B Pogaru, Giri Poonati, Rajat Babbar, Goutham Reghu, Saumy, Vedant Kulkarni, Andrii Patrylo, Cyrus Britto, Dipesh, Mohini Sharma, Jone Daniel Derickson D, Razvan Gabriel Apostu, Ankita Saurav, Pranav M. Menon, Augusto Sampaio, Shivani Pallerla, Vanshika Singh, Abhay Chopra, Kristián Ulrych, Manivannan Sundaram, SANGWHA CHA, John Dobie, Aevant Anil Jain, Omkar, Atul Bejoy, Cindy Quach, Prakriti Bisht, Soumyadeep Roy, Ankit Dularia, Laheesh, Bhavya Sharma, Dhiren Valecha, Chang Mou, Omar S, Abirami CB, Ivan Shuvalov, Saachi Mehta, Ravi Tej, Rhea Kapur, Saanel Bhatnagar, Khasan Hatoyan, Jinesh Bhaskaran, Harshit Chaturvedi, RamKumar, Sajal Kumar, Dhawal Harchani, Priyansh Jolapara, Shravan Kumar PS, Manish D, Nikita Simotko, Manoj Prabhakar, Hridae Walia, Rishabh Soni, Yuvraj Singh Choudhary, Kevali Awate, Vysak AS, Seemant Shekhar, vyom verma, Akash Kumar, Sooraj Nair, Ajay Khatri, Brijesh Kumar, Kushagra sharma, Parash Rautela, Adyasha Padhy, Augustine Asiuwhu, Sneha Karunanithi, Karthik Sivacharan, Avikshith, Edin Le, Renée, EZHILARASAN M, Shaurya Singh, Kashish Gakhar, Manu lal, Raina Ghosh, Ronit Mohata, Shweta Bankura, Aashka Patel, Kasey Randall, Gergő Bartha, Jayesh Phadnis, Kyle Bowman, Aishani Patial, Akash S, Advait shripad Ramdasi, Abhay Senjaliya, Deen Dayal, Naga Sai, karthik sr, Abhishek Waghela, Harsh Vardhan, Kaushik Deka, Yaning Hu, Saikiran Reddy, Aalhad Joshi, Avni Mittal, Akshay Vinchurkar, Krishna Nihar, Himanshu Gupta, Navyaa Taneja, Himesh, Ayushi Sethia, Atishya Gupta, Somnath Mahanta, Gaurang Chadha, Yuvraj Singh Rana, Shivam Arya, Viswakanth S, Kartikey Gupta, Shreyans Harsora, Gayatree Nivdekar, Sruthi Madhusudanan, Besil chandy, Rishikesh, Kavidhasan M, Sujit Kumar Pradhan, Alexander James Arcari, Vinyas Pandey, Trushank Mistry, Jaber Elferkh, Yugesh Ralli, bablu bhoi, Priyanka Rathi, Karthika P Suthan, Mayur Patil, Abhishek Gupta, Sanjana Baweja, Somnath M, Sanjay adhithyan, Maitreyi Chavan, Inès Gruhier, Devansh Prakash, Deepak Mangapuram, Rinky Yadav, Vanshita Aggarwal, Apoorv Tyagi, Ayantan Chatterjee, Siddharth Batheneni, Pavel Mondal, Nandini Vyas, Shatakshi Singh, Prerna kohli, dipanshu saini, Sahiti Malyala, Queenie Shu-Ying Hsiao, Austin de Nijs, Tanishq K., Dinidu Missaka, Gopinath, Krathish Prakash, Rushi Godhani, Vilmar Fernandes, Harsh Shah, Karan Shah, Prachi Pancholi, Piyush Passi, Vaishnavi Patil, Shourya Dubey, Arushi Agarwal, Sadhin Saleem M P, Sanika Mehta, Mahalakshmi TM, Mayur Chettiar, Yuktha Veeranki, Sakshi Rane, saransh agarwal, Ayan Aggarwal, Vimal Kumar, Priyanshu Barnwal, Darin Menezes, Priyadharshini Sivakumar, Avnish Poonia, Satvik Shrivastava, George Philip, Trishabh Vats, Honey Gathani, Subrojit Saha, Anuja Harsha Nimmagadda, Rahul Jaiswal, Yashasvee Mehrotra, Yash Shenai, Nalaprasad D, Namrata Satapathy, Karan Chaudhary, Panth Shah, Anurag Kumar, Mansi Mehta, Shreya Jindal, Shubhang Rajput, Moe Ebii, Abhishek Kumar, Nikhil Gara, Sidhant Goyal, Sanjith T S, Nikhil Kairamkonda, Jitendra Kumar, Lakshita Sethi, Priyan Desai, Dipti Golecha, Mithali Kini, Venkatesh BR, Sanket Sugaonkar, Mehul Kundu, José Bernabé, Jon Hanlan, Rohan A, Perry wang, Ishani Pandey, Charles Shin, Yugal Mahajan, Yashwin Ghosh, Vivek G, Vishal S Krishna, Varun Y., Vaibhav Lakhmani, Syed Rameez A, Swatishree Mohapatra, Sunil Sharma, Sugandh Agrawal, Stefano Tirloni, Srijan das, Sourabh Patil, Shubham Singh, Shubham Ranga, Shreyas Bhosale, Shrey Trivedi, Shreshth Kanojia, Shobrun Jamil Bagastio, Shashank Agarwal, Saloni Mhapsekar, Roshan Thomas, Raunaq Shah, Rakibul Hasan, Rajat Sethi, Rahul Goradia, Proloy Ghosh, Priya Makwana, Prerna Bajaj, Pooja Ramesh, Phanindra Mollate, Patrick Flaherty, Paresh S, Owen Hudock, Nitish Bhardwaj, Niral Patel, Nandini gangal, Murali D, Muhammad Shehata, Mohammad Sayyar, Milan Reed, Milan Maheshwari, Mehak Kothari, Mark Maurice, Maninderjeet Singh, Lalitya Sahu, Keerthivasan Manivannan, Kaveen Srikanthan, Kashish Bhumbri, Joshua Rajan, Jorge Muñoz Lozano, Jia Rong, Jayapal Reddy, Jackie Vu, Ishika Mitra, Indra Kumar, Himanshu Saini, Hieu (William) Le, Guruprakash Adimulam, GOKUL KRISHNAN, Gaurav Singh, Gaurav Kumar, Dilip Kumar S, Diego Villarroel, Dhimas putra, Dhaval Walavalkar, Deen Dayal V, David Huynh, Darrpana N, Dale Williams, Daksh  Aswal, Chris Chen, Chimdindu Chimereze, Chethan KVS, Biplab Basumatary, Basavaraj S S, Ashraf Shaikh, Ashpreet Singh, Ashish Gupta, Ashish Devadiga, Arsh Kaushik, Arnab Debnath, Anushriya Bhardwaj, Anupam kumar, Anuhya Kanukuntla, Anshul Vora, Ankur Juneja, Anirudh Goyal, Angad Singh, André Rodrigues, Anchit Banga, Anaghaa Chakrapani, Adreesh S, Abhijith Ms, Abhiek Biswas, Abhay Rahul, Sudeep, Jithin G Mohan, Swastik Pradhan, Yashvardhan Bhardwaj, Agustian George, Astuti Srivastava, Yenfu Chen, C P Samyuktha Nair, Umar Farooq, Priyashree Acharya

</details>

<details><summary>All 91 names on Modern Layout</summary>

Bonnie kate wolf, Laveek Garg, Solomia Kravets, Justin McKissick, Tarushi Jindal, Neeru Yadav, Harsha Bardhan, Siddhant Ghosh, karan kapoor, Rajdeep Ghosh, Abhay Chopra, Twinkle Das, Quach Tuyet Linh, Tamilkumaran Kanagaraj, Kashyap Rayas, Manya Vij, Shourya Sharma, Ernesto Alonso, Abhra Sengupta, Swapnil Tchïtnis, Rakshita Issrani, Parash Rautela, Opal P., Afnizar Nur Ghifari, Giacomo Dal Prà, Sahaana Shankar, Sydney Yeom, Amey More, Shivanshu Gupta, Yashashvi Bisht, Kaushik Das, Soniya singh, Charis Pao, Dawn Biju, Subhankar Saha, Vignesh N, Atharva Potnis, Romeet Chatterjee, Soumya raj, Jessica Mangoni, Arsen Kolyba, Tanishq K., Boris Verks, Javeria Syed M, Vlad Zaporozhskyi, Sierra Kealoha Ching, Ashwin Bajaj, Kushagra Kishore, Moe Ebii, Tanya Lee, Janani Sridharan, Parth Jhawar, Gagarina Nath, Sarthak Prakash, Harini Suresh, Sanchari Saha, Shreyas Deshmukh, Vivek Sati, Vidhi Mishra, Vardan Sharma, Stefano Tirloni, Shubham Singh, Serkan Hürsgünel, Sandy Galabada, Sandhya Ravindran, Salaath Shaikh, Sakshi Jain, Ritika Sharma, Rajeshwari Rathi, Rahul Rao, Pratiksha Chettiar, Nandini gangal, Mohnish Landge, manish jangir, Kiran Banstola, James Alonso, Jahnvi Batra, Harsh Tandi, GOKUL KRISHNAN, Evgeny Mishin, Ethan Chng, Ellita Nuryandhani Ananti, Dhamiem Ansari, Deepan Karthick, Dave Lee, Apeksha Jain, Anushka Tendolkar, Anchit Banga, Alessandro Giammaria, Abhishek Sharma, Rahul Agarwalla

</details>

<details><summary>All 540 names on Minimalist</summary>

Jennifer Chung, Tanuja, Inez Prawiradirdja, Bharti Gaur, Dikshit Kashyap Das, Harshitaa P Rajan, Gaurav Mishra, Julia Lazovskaya, Rachel Chen, Meghan Rose, Asit Khanda, Swarnima Shukla, Anukriti Vijayavargia, Aditya Muralidhar, Ivo Damjanovski, Anamika Tripathi, Yinyee Ho, Ilia Kovalev, Harshvardhan Chaudhary, Debiprasad Sena, shriya paranjape, Inesh Jain, Soundar Krishnaswamy, Sanjana Londhe, Teja Reddy Bavikala, Deepak Naidu, Mohan, Anumeha Jain, Lalu Nihal, Aditya Khadke, Vaibhav Verma, Neel Shenoy, Sai Tharun, Prasha Roy, Adithya Krishna B S, Ishika Jagatramka, Vijay Gupta, LiWei Chen, Jessica Li, Aditi Raghav, Devanshu Chauhan, Anna Bakaeva, Krishna Gaurav, Shahriyar Mohammadi, Luan de Souza, Pratap Bhagat, Sam Malone, Girish Dewangan, Dilroop L, Simran Gupta, Anjali Agrawal, Allan Kirsten, Sanmid Anavkar, Manya Singh, Darina Usanova, Lin Peng, Gobi Siva, Thejas Hassan Ravishankar, Mohammed basith, kamaljeet singh, Vaibhav Shukla, Rithvika Reddy, Parth Jha, Arkoprabho Bhattacharjee, Elise Alinsug, Sneha Tamhankar, Akshay Mehta, Lakshmanan Palani, Micah Hoang, Modeera Fatima, Abhijeet Lagade, Vasanth Ramachandran, Sudhanva Acharya, Kishan Vagale, Harshdeep Kaur, Kartik Goel, Shahroz Ahmad, Vincent Rodriguez, aya Sherby, Keerthi Gurram, Karthik M, Solomia Kravets, Rahul R Nadkarni, Anurag Bose, Jerry Chen, Sabhya Singhal, Anubhab Bora, McLane Teitel, Aromal Ashok, Gowtham Oleti, Priyanshi, samiksha jain, Rajan Dube, Rujul S, Ayaneshu Bhardwaj, Cara Ellis, Diya Todkar, Harish Kumar, Adrià Tormo, Yash Desale, Himanshu Bhardwaj, Rishivaths M S, Purva Bhandari, Rakshit Keswani, Shubham Tyagi, Vishesh Gupta, Shubhransh Bhaskar, Archie Pareek, Saket Joshi, Lokesh Maripally, Aakriti Maheshwari, Lakshya Kumawat, radhika vijay, Priya Sunny Thomas, Devika Kohli, Dnyanesh Gore, Ellison Huang, Kishen Nl, Rama Krushna Behera, Siddhant Kapadne, Prachi Pandey, shreeya desai, Kishore S, Ankur Yadav, Dhiraj Chouhan, Kunal Satpal, Swaraj Patil, Ashu K, THEJA C, Isabelle S, Prince Pal Singh, Maria Teresa Stella, Raghav dua, Prateek Singh, Nikunj Goyal, Kamini Choudhary, Geonwoo John Yang, Sriti Chamola, Diksha Dayal, Akash Pandey, Anjali Bhati, Sarthak Upreti, Gauri Chakravarti, Akash Nagaraj, Utkarsh Verma, Debarashmi Roy, Bhaskar Tiwari, Zeel Shah, Rahul Padsalgi, Dinesh Revunuru, Saiel Murdeshwar, Tushar Prakash, Raj Kumar, Sonal Soni, souvik pandit, Neha Jangid, Jennifer Romo, Tong xing, Stella Peng, Prerna Pandey, Arnav Sharma, Mary Clements, Kiara Di Gregorio, Adarsh Shandilya, Alice liang, Janhavi Kadam, Ricardo Portocarrero, Abhinandan Gupta, Yazeed Kamal, Muhammad Zohaib, Aditya Pratap Singh, Gagan Deep Kardam, Shubham, Parasuraman Kannan, Vasundhara Mahour, Akriti Jaiswal, Abu Syeed, Aanchal Gupta, Rahul Kumar, Siddhant Ghosh, Shivam Thapliyal, Antonio Pires, Dimpal Gidwani, Debodyuti Biswas, Eduardo Duccigne, Ellen Damazio, Anushka Jain, Jobish K M, David Bruggisser, Emmanuel Eniabiire, Aman Tripathi, Cindy Ly, Sam Santos, Egor Finko, Gayatri Ketharaman, Akash Bhadange, Sachin Gopakumar, Hanna Xu, Mohit Bairwa, Sugandha Jain, Judhajit Debnath, Esha Chidgopkar, adarsh panikkar, Hemang Sharma, Basharat Faiz, Anuj Bhargava, Cindy Huang, Sagar Kumar, Yash Bhagat, Prabodh Bharadwaj, Ayoposi Otubanjo, harismita govindaraj, Anjali Singh, Sourav Mahapatra, Felipe Cardona, Raza Rameez, Mohammed Sahad kk, Mohd Bilal, Shalaka Balde, Rayoti Kar, Kat Angeles, Hemanshu Patel, Bogdan Goncharenko, Ryan Phillips, Ronald Rosales, Colin LeBlanc, Harshita khanijo, karan kapoor, Anurag Krishna K B, Kirill E, Shivali Meenakshi Murali, Akhilesh Saurabh, Yuan Jie, Kartik Pathak, Andreas Katzmann, Ritwij Goswami, Sara Khalil, Saanvi Jain, Meenakshi Shyamsundar, kritika singhal, Bruna Guimarães, Prachi Padia, Naziat Chowdhury, Sayya Dushanbieva, Priyanshi Mathur, khushi banthia, Parna Sarkar, Harshit Singh, Akhil Kumar S, Andrei Protasevich, Eucharia Odili, Pavel Mondal, Hari Krishna, Oleksandr Yeromin, Vigneshwar, Aditya Kr. Singh, Cyrus Britto, Rajdeep Ghosh, Sunny Joshi, Shubhika Batra, Aryan Verma, Muhidul Hasan, Paridhi Mundra, Xhulia Frroku, Syahdan Edy Murad, Varesh Mukhekar, Shreyas Chaudhary, Shanu Kumar, Sixian Chen, NIKHIL SOREN, Parul Chouhan, Tuhina Choudhury, Prerna, Ilia Lushnikov, Somya Jain, Amulya Vijaywargiya, Ganesh Velisala, hariram manglaw, Ayushi Sharma, Genesis P. Miranda Jr, Sacchitanandi Ganpathiraju, Keerthana Sanjay, Blair Gibson, Jiwon Park, Harshavardhan, Shaurya Chopra, Aastha Pareek, Nishit Mangal, Tanya Sharma, devatri banerjee, Darshan Daiv, Issac Sinha, Prince Kumar, Adarsh Tribhuvan, Aastha Laddha, Aditya Sharma, Sandeep Kumar shantanu, Vladislav Kotyrev, Nynika Badam, Shakira Yanti, Atharva Keshattiwar, shyam kishorre, Kumudini Chauhan, Priyal Jain, Vishesh Patel, Saswat Dash, Ayush Singh, Komal, Ishika, Ashok Singh, Kishore Khaware, Gurjot Singh Ahluwalia, Basma Yasser, Salvador Xe, Dhruvi Bhansali, Megha Goyal, Zenan Liu, Christine Jung, Abdul Jabbar, Leah Kim, Dinesh Senapati, Saanel Bhatnagar, Hemanth Ravindran, Prathyusha Shastry, malavika valsan, Yuxuan Hou, digvijay shelar, Avantika Pidiha, Vandana Singh, Damini Sharma, Pooja Kumari, Akash Bhavsar, Deepen Vora, Jennifer Lee, shyam bharadwaj, Israel Adegbulugbe, Parinita Rai, Jena Doshi, Shreyansh Singhvi, Amaraja Sathe, Vrishti Chawda, Balarengam K, Sai Tongaonkar, Robert Pham, Isha Todkar, Ramy Baiche, Manasvi Shah, Tanvi Pisal, Amarsh Vutukuri, Amit Sharma, Dobritoiu Tudor, Deepanjan Sen, Fabio Freire, Akash Mounabhargav, Sujay Adithya, Pragya Mandloi, Anupam Malhotra, Uday Kiran Karanam, Ananya, Jessica Yoon, Surjith, Madri Venus, Ron Thomas George, Nate Bauer, Jaime Carrasco, Venkataramana, Dhvani Pranav Shah, Ivan Annikov, Sahil Waghmare, Rucha Kshirsagar, Anshika Srivastava, Osama Noor, Platin Gjochi, Teresa Melvin, Saahir Shetty, Carolyn Tung, Jayesh Seth, arnav gupta, Bruno Justo Pego, Gurwinder Singh Multani, Amay Bharadwaj, Qasim Khalid, Preston Booth, Sreedhar Truly, Bhavya Mittal, Kritarth Singh, Divakar, Rahul Rane, Akhil Krishnan, Gregory Muryn Mukha, Meet Jain, Vibhuti Pitale, Piyush Kumar, Yury Gargarin, ashley sheo, Kaushik Shaw, Dozie Uzoechi, Swapnil Nikam, Sanchita Thiagarajan, vartika gupta, Sasongko Budhi R, Anna Kuznetsova, Anjani Pandey, Nikhil V, sridhar pulimamidi, Sayan Mondal, Niharika Bankapure, JITHUNA DAS, Nandini Venugopal, Jean Bragantin, Bruna Hirano, Edu Cabellos, Saurabh Das, Justin Mason, Marta Fiorese, Utkarsha Kate, Talal Jawaid, Vishruth Ashok Kumar, Rahul Mohan, Grace Lal, Eduardo Zapata, Vijay Saiwal, Eshita Akella, Mert Öztopkara, Dev Chaudhary, Anuj Singh, Aashna Keswani, Victor Barreto, Shreya Chadha, Luciana Vitória, Nina Chernenko, Ameer Hamza, Suhail Quraishi, Jacob Dilley, Harshita Yadav, Volodymyr Onishchenko, Shaivy Bhatia, Ben Roach, jithin rp, Tejas joshi, Abdumalik Abduvakhidov, Krishiv Surelia, Thiago Monteiro, Geetika Palande, Amanda Pinto, Aniket Shinde, Linh Hoang Tran, Anatolii Bolshanin, Devyani, Pradnya Mohite, Jatin Palande, Ishu Sharma, Thiti Thanachaipornsakun, Syandan Roy, Rohan Dharane, Kshitij Suri, Devesh Kailay, Smruthi K S, Hasan Nawaz, Devanshu Soni, Clarisse Pelayo Sicat, Nathan Madsen, Surya Mudaliar, Ria Vijay, Lahari Sri Thamilselvan, Faisal Quadeer, Natallia Lisouskay, Uday Shankar, Aman Gautam, Yash Gupte, David Wenk, Valery Fironov, Siddhida Bargode, Max Tsvetkov, Chaitanya Sai, Naishi Shah, Shambhavi Phule, Chembrath Sandeep, Rahul Raj Singh, Saidiya KC, Soundarya Raman, Nishta Srinivasan, Aryaa Bedekar, Itti Joseph, Vivek das, Vlad Kanygin, Arthi Abilasha, Rahul Edathil, Amrit Aaryan, Narayan Ashanahalli, Harsha Gowda, Vikas Shetty, Priya Jain, Nisha Jain, Alice Lee, Suhad Mohammadi, rashmi bhatia, Karthik, Priyamwada Pandey, Karim Soliman, Rithvik Jai Shanker, Peshala Dayanatha, Michael Rodionov, Mariana Ponte, Joel Fisher, Emisho Victor, Khushi Gupta, Daniel de Paola, Megha Khulbe, Sam George, Nikita Petrov, Samet Özkale, Sam Joy, Pradeep Bhandari, Saher Ahmed, Shehryar Ahmad Chaudhry, Manoj Kumar, Nida K, Tejas Chaudhari, Alex Neto, Claire Chéry, Pradeep Prakash, Eniola Aigbokhaode, shiva kumar menda, Yu-Hsin Lin, Hitesh Singh Bisht, eugene wan, Chris Huban, Michelle Chiu, Shri nikesh R, Jacey Chung, Dias Fomovich, Siddharth Chhatpar, Samuel Muñoz Gonzalez, Gayakwad Mayur, Aditya Tanwar, Saurabh Singh, Navya Jain, Praneeth reddy, Sachin Kumar Sahu

</details>

## Step 2: the sites

Studied: the 12 Creative sites the brief named (minus Adya Srivastava and Sudarvel K) plus the 3 Interactive extras. Scores are 1 to 5. A = interface, B = visual design, C = motion. Clicks to work counts clicks or scrolls from the first screen to a readable project.

| Site | Calm med [range] | Busy med [range] | Hues | Sat | Lum | Screens | Fonts | Idle change | Clicks to work |
|---|---|---|---|---|---|---|---|---|---|
| Rezwanul Choudhury | 54 [52–67] | 18 [16–23] | 4 | 14 | 85 | 1 (canvas) | 6 | 0.0 % | 0 to see, 2 to read |
| Royden So | 70 [61–80] | 7 [3–11] | 3.5 | 22 | 39 | 6.0 | 2 | hero video only | 0 to 1 |
| Loveleen Pereira | 69 [61–86] | 8 [4–16] | 4 | 23 | 54 | 6.4 | 8 | 7.4 % | 1 to 2 |
| Sahil Betigeri | 21 [8–49] | 44 [12–64] | 8 | 46 | 43 | 11.1 | 12 | 68 % | 1 scroll |
| Rolan Gomes | 1 [0–15] | 15 [8–23] | 3 | 37 | 62 | 6.9 | 4 | 0.5 % | 1 scroll |
| Harshini P Rajan | 47 [43–52] | 32 [31–32] | 3.5 | 39 | 69 | 1.4 | 1 | 12.4 % | 1 |
| Shalmali Gaikwad | 44 [15–84] | 8 [1–30] | 4 | 25 | 80 | 8.4 | 3 | 28.7 % | 1 scroll |
| Vibhor Mathur | 46 [46–46] | 18 [18–18] | 4 | 19 | 64 | 1 (3D) | 3 | 16 % | 1 to 2 |
| Natania Doshi | 33 [23–49] | 29 [21–32] | 6 | 31 | 58 | 3.4 | 2 | 2.3 % | 1 scroll |
| Himanshu Shakit | 22 [18–44] | 21 [11–31] | 6 | 24 | 53 | 9.0 | 1 | 0.0 % | 2 scrolls |
| Failenn Aselta | 63 [48–68] | 13 [5–23] | 4 | 3 | 81 | 3.8 | 1 | 3.3 % | 1 |
| Arshvardhan Bishnoi | 68 [36–83] | 13 [6–34] | 4 | 6 | 13 | 10.6 | 3 | 0.1 % | 2 scrolls or 1 click |
| Shashank Khambhaita | 8 [8–8] | 41 [41–41] | 6 | 43 | 27 | 1 (room) | 2 | 5 % | 1 to 2 |
| Oorja Kapoor | 52 [45–80] | 23 [5–25] | 5 | 59 | 32 | 2.2 (pinned) | 5 | 0.1 % | 1 to 2 |
| Madhur Rastogi | 65 [34–85] | 11 [4–18] | 4 | 6 | 84 | 18.8 | 3 | 0.0 % | 3 scrolls |

Rolan Gomes' calm figure is low only because the whole background is grid-paper texture; the content column itself is calm.

### 1. Rezwanul Choudhury

Lead Visual Designer, India. https://rezwanul.com/

- Busyness at 1440 (6 stills): calm 54 % [52–67], busy 18 % [16–23], hues 4, saturation 14, luminance 85.
- Screens: 1 (a pannable canvas; the page itself does not scroll, wheel does nothing). Work page `/wrk` is 1 screen of desktop folders.
- First screen: about 18 things compete (name lockup, 4 arrow labels, intro paragraph, about 12 stickers and photos around the edge). Fonts: 4 display faces on screen 1 (Ransom Pixel, PP Mondwest, PP NeueBit, That That New Pixel) plus Inter and Geist. Work pieces visible on screen 1: about 8 stickers that are real work (Skid, Suzuki, Prevo cards).
- Path to work: 0 clicks to see work stickers; 2 clicks (Work, then a folder) to read a project.
- Load: 1.6 s blank cream, then an intro collage (name + red car + 4 portrait photos) builds in about 1.5 s, then the canvas replaces it.
- Scroll: wheel does nothing (all 30 steps measured 0 px shift). Drag pans the canvas 1:1; a quick 200 px flick keeps gliding after release (22 % of the screen still changing 600 ms after mouse-up).
- Hover: top-bar links 0.3 % change; stickers do not react.
- Idle: 0.0 % change in 1.5 s.
- Phone: one screen with the name, arrows and intro centred; canvas drag on touch not tested.
- Project page: clicking a folder opens a macOS-style window (traffic-light dots, title "Skid - Auto Insurance") with a 48 px blue pixel-serif title and grey body text at about 20 px with very loose leading.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 4 | Huge pixel name in the centre, one-line intro, and four arrow labels (work, not-so-work, about me, playground) say what to do. |
| A2 Path to work | 4 | Work stickers sit around the name from the first second; a readable project is 2 clicks away (Work, folder). |
| A3 Orientation | 3 | Blue top bar with About Me / Work is fixed, but on the canvas there is no map or 'you are here'. |
| A4 Reading | 3 | Intro at about 20 px is fine; cluster captions are about 11 px grey on cream. |
| A5 Calm | 3 | Centre is clear (median calm 54 %), but about 12 stickers ring every edge. |
| A6 Consistency | 4 | Folders, folder labels and window chrome are the same everywhere. |
| A7 Phone | 3 | Phone shows the centred hub only; the canvas becomes a single screen. |
| A8 Plain path | 3 | `/wrk` gives a plain folder list; without dragging, the home page shows only the hub. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 5 | A designer's table you pan across, carried into the work page as desktop folders and windows. |
| B2 Composition | 3 | Name first, then a ring of equally loud stickers. |
| B3 Colour | 4 | Cream ground with graph-paper lines, one electric blue (#0A2BE0) for bar, name and links. |
| B4 Type | 3 | Four pixel display faces at once; on concept but crowded. |
| B5 Image-making | 4 | Stickers are real pieces of the work, cut out with soft shadows. |
| B6 Space | 3 | Clusters are equally dense in every direction; no quiet region except the hub. |
| B7 Finish | 4 | Neat sticker shadows, aligned folder grid. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 4 | Canvas moves only when you drag; the intro plays once. |
| C2 Amount | 5 | Idle 0.0 %; nothing moves unless you drag. |
| C3 Timing | 4 | Drag is 1:1 with a short inertial glide of about 0.6 s. |
| C4 Scroll | 2 | The wheel does nothing; travel exists only by dragging. |
| C5 Feedback | 2 | Stickers and links barely react on hover (0.2 to 0.3 %). |
| C6 Entrance | 4 | Intro collage assembles in about 1.5 s, once, then cuts to the canvas. |
| C7 Rest | 5 | Fully still after the intro. |

**What makes it work**

1. **Hub-and-spokes canvas.** The name lockup (about 520 px wide, two lines of pixel type, blue over black) sits dead centre on a cream graph-paper ground. Four short italic labels with arrows (up "about me", left "work", right "not-so-work", down "playground") and a tiny "drag to move" icon sit 40 px under it. Each direction leads to a cluster, so the arrows double as a map.
2. **Clusters with a heading and a paragraph.** Each region of the canvas has a small italic heading ("*branding / tech"), a 6-line grey paragraph about 260 px wide, and 6 to 10 cut-out work pieces scattered around it at slight angles with soft drop shadows. A blue folder icon with a 10 px label ("Skid - Auto Insurance") marks the way into each project.
3. **Drag with inertia.** Pointer-down anywhere pans the whole canvas 1:1; release keeps it gliding and easing to a stop in about 0.6 s.
4. **Projects open as windows, not pages.** The Work page is a 2-column grid of 6 folders; a click opens a white window with three traffic-light dots and the project title, over the same graph paper.

**What it avoids**: No scrolling sections, no hero image, no cards, no hover effects, no idle animation, no footer.

### 2. Royden So

Product Designer, United States. https://roydenso.com/

- Busyness at 1440 (6 stills): calm 70 % [61–80], busy 7 % [3–11], hues 3.5, saturation 22, luminance 39.
- Screens: 6.0 at 1440. Fonts: 2 (PP Neue York Normal and Narrow). First screen: 4 things (small title "Product and Brand Designer", the held card, 3-link nav, "featured on" line). Work pieces visible on screen 1: 1 at a time (the card cycles through 4 or more projects).
- Path to work: 0 (the hero card shows work); first project section 1 scroll down.
- Load: dark ground and title at 1.1 s; two hands slide in from the bottom edges holding a white card (about 400 x 260 px) in 0.3 s; the card face then cycles project images.
- Scroll: plain native scroll (each 30 px wheel step moved the page 28 to 32 px; 3 % residual change from the hand video). Settles instantly (0.0 % after 1.2 s).
- Hover: nav item "Index" turns into a small "< • >" pill in 100 ms; footer "Framer" link reveals a strip of photos behind it.
- Idle: the hero card keeps changing pictures (video); the rest of the page is still.
- Phone: designed (hero card scaled to full width, sections stack, menu icon).
- Project page (`/sabotage`): full-bleed photo of a monitor in a room with the site on it, a one-line stat ("~3 seconds from Publish to the live site") in 28 px, then alternating full-width photos and 2 to 3 image grids, with an "Impact / Studio / Pages" sub-nav at the top right. 10.5 screens long.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 5 | Within a second: 'Product and Brand Designer' over hands holding a card that shows the work. |
| A2 Path to work | 5 | The hero card is the work; the first case study is one scroll away. |
| A3 Orientation | 4 | Thin fixed top bar (Royden So, Index, Home, About, Reach out) on every screen. |
| A4 Reading | 4 | High contrast (near-white on #080C0D, black on white); body text 14 to 16 px, some captions 11 px. |
| A5 Calm | 5 | One object per screen with wide empty ground; median calm 70 %, busy 7 %. |
| A6 Consistency | 5 | Every project block repeats: title, one-line pitch, 'Learn More'. |
| A7 Phone | 5 | Phone version is a designed stack with the same objects full width. |
| A8 Plain path | 4 | An Index page lists everything as text; nothing depends on motion. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 4 | 'Analog craft meets digital': real hands, paper, pens and devices in every image. |
| B2 Composition | 5 | Each screen has one big photo, then a title, then a small link. |
| B3 Colour | 4 | Black and warm white grounds; the colour comes only from the photographs. |
| B4 Type | 4 | One serif family in two widths; small sizes, so the display type is quiet rather than characterful. |
| B5 Image-making | 5 | All photographs share one lighting and hand-held style. |
| B6 Space | 5 | Dark hero, then white 3-up grid, then a full photo, then a dark footer; rich and quiet alternate. |
| B7 Finish | 5 | Exact edges and even gutters throughout. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 4 | The hero card cycles work so the motion shows projects; everything else moves only on hover. |
| C2 Amount | 4 | Only the hero card moves; the other 5 screens are still. |
| C3 Timing | 4 | The hands slide in in about 0.3 s with an ease-out; nav morphs in 100 ms. |
| C4 Scroll | 4 | Native scroll, 1:1, nothing pinned or hijacked. |
| C5 Feedback | 3 | Nav and footer links react; project tiles do not visibly react. |
| C6 Entrance | 4 | Title first, then hands and card arrive once. |
| C7 Rest | 5 | Below the hero the page is completely still. |

**What makes it work**

1. **One held object as the hero.** A centred white card (about 400 x 260 px at 1440) held by two photographed hands on a near-black ground. The card face is a slideshow of project screens, so the first screen shows the work without any grid. The title above it is only about 22 px.
2. **Full-width photo per project, title centred over the top quarter.** Each project gets a 1440-wide photograph of an object (a phone in a tray, a monitor), with a 28 px title, one grey line and "Learn More" centred above the object.
3. **3-up grid for smaller projects.** Three equal tiles with no gaps between them, each with its own background tone (white, black, grey) and a title at the top; the change of tone separates them, not borders.
4. **Morphing nav item.** On hover "Index" turns into a small rounded pill with "< • >" in 100 ms: tiny feedback, no colour.

**What it avoids**: No loader, no custom cursor, no scroll-driven animation, no parallax, no display type, no colour accents, no icons.

### 3. Loveleen Pereira

Multidisciplinary Creative, India. https://loveleepereira.com/

- Busyness at 1440 (7 stills): calm 69 % [61–86], busy 8 % [4–16], hues 4, saturation 23, luminance 54.
- Screens: 6.4. Fonts: 8 families loaded (IBM Plex Mono, Courier Prime, Anton, Mrs Saint Delafield, Caveat, Special Elite, Times New Roman Condensed, Quicksand); 3 on screen 1. First screen: about 16 things (script name, mono intro, 3 tool buttons, about 12 objects: lamp, clapperboard, cassette, matcha bowl, globe app icon, folder, phone and hand drawings, polaroid, note card, cookie, mascara).
- Path to work: 1 click (Work) to 7 category tiles; 2 clicks to a project.
- Load: in a cold headless load, nothing useful appeared for about 7 s; then the desk appears complete.
- Scroll: smooth-scroll with easing (22 % of the screen still moving 1.2 s after the last wheel step near the top, where a pink marquee ribbon runs).
- Hover: the cursor is an orange arrow with an orange "Loveleen" name pill (like a Figma multiplayer cursor); hovering the name swaps it for an ID-card ("LICENSE") image within 400 ms; the cassette says "Tap the tape to play" and plays music.
- Drag: the polaroid ("me, at work") follows the pointer and stays where it is dropped (moved 400 x 100 px, no snap back).
- Idle: 7.4 % (small specks drifting across the rose ground).
- Phone: designed; objects rearranged around the name, bottom pill nav.
- Work page: "← back to the desk", script "Work" title, 7 tiles (about 135 px squares) in dashed frames numbered (01) to (07), two marked "Coming soon", and a "Keep scrolling" pill.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 4 | Script name, 'Multidisciplinary Creative' and a 3-line intro in the centre of a desk of objects. |
| A2 Path to work | 3 | Work is a nav click away, and a project is a second click. |
| A3 Orientation | 4 | Top nav with underline on the active item; 'back to the desk' on inner pages. |
| A4 Reading | 2 | White 11 to 13 px mono text on dusty rose #A47F7F is about 3.5:1 contrast. |
| A5 Calm | 3 | Centre is clear (median calm 69 %), but about 12 objects ring it. |
| A6 Consistency | 4 | Windows, tiles and pills share one style. |
| A7 Phone | 4 | Phone is designed: objects re-placed, bottom pill nav. |
| A8 Plain path | 3 | Content is real text, but a custom cursor and a 7 s load stand in the way. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 5 | 'My desk': scattered personal objects, and every inner page leads 'back to the desk'. |
| B2 Composition | 4 | Name first, intro second, objects third. |
| B3 Colour | 4 | Dusty rose ground, olive and maroon line drawings, one orange accent. |
| B4 Type | 3 | Eight families loaded; three distinct voices on screen 1. |
| B5 Image-making | 4 | Real photographed objects mixed with maroon line drawings; two styles but one palette. |
| B6 Space | 4 | Busy desk, then a quiet olive 'About Me' panel, then sparse gallery windows. |
| B7 Finish | 4 | Careful object shadows; small text sizes are inconsistent. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 4 | Objects respond to you: drag the polaroid, tap the tape, hover the name. |
| C2 Amount | 4 | Only faint specks drift (7 %). |
| C3 Timing | 4 | Hover swaps take about 0.3 s; drag follows the pointer directly. |
| C4 Scroll | 3 | Smooth scroll lags the wheel; a marquee ribbon runs near the top. |
| C5 Feedback | 5 | Named cursor, image swap on the name, every object reacts. |
| C6 Entrance | 2 | About 7 s before the desk appears on a cold load. |
| C7 Rest | 4 | Settles except for the drifting specks. |

**What makes it work**

1. **A desk of real objects around the name.** A 2-line script name (about 140 px cap height, white) centred in a dusty-rose field, with about 12 photographed or line-drawn objects pinned to the edges, each at a slight angle with a soft shadow. The middle third of the screen stays empty around the name.
2. **Objects you can pick up.** The polaroid can be dragged anywhere and stays where it is dropped; the cassette tape plays music on tap; the globe and folder are labelled app icons ("PLACES", "APPS").
3. **Named cursor.** The pointer is a small orange arrow with a rounded orange label "Loveleen" (about 80 x 26 px) attached, so the visitor is 'in the room' with her.
4. **Stamp-frame tiles for categories.** The work page shows 7 square thumbnails, each inside a dashed brown frame like a postage stamp, with a mono number above and a label below.

**What it avoids**: No big photographs on the home screen, no grid of project cards, no scroll animation on the hero.

### 4. Sahil Betigeri

Artist and Designer, India. https://www.sahilfromnature.com/

- Busyness at 1440 (12 stills): calm 21 % [8–49], busy 44 % [12–64], hues 8, saturation 46, luminance 43.
- Screens: 11.1. Fonts: 12 Wix web fonts. First screen: a full-screen video of morphing chrome forms with about 8 stickers (eye, yellow ball, star, pixel text "Sahilfromnature"). Work visible from the bottom of screen 1; screens 2 to 11 are a masonry wall of 8 to 12 artworks each.
- Path to work: 1 scroll.
- Load: the chrome video plays from the first frame; the title letters appear one by one over about 1.5 s.
- Scroll: plain scroll, but 18 to 35 % of the screen changes beyond the scroll shift on every step because many tiles are animated GIFs or videos.
- Hover: the measured targets showed no reaction.
- Idle: 68 % of the screen changes in 1.5 s (hero video).
- Phone: not responsive; the 980 px desktop layout is shown cropped (text cut off at the right).
- No case-study pages; `/about` is a single screen.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 3 | The first screen is a chrome video and a pixel logo; who he is only appears on screen 2. |
| A2 Path to work | 4 | Art starts at the bottom of screen 1. |
| A3 Orientation | 2 | No persistent nav; links are words inside the intro paragraph. |
| A4 Reading | 3 | Intro text is large, but some sits on busy collage. |
| A5 Calm | 1 | Median calm 21 %, busy 44 %; every screen is full. |
| A6 Consistency | 3 | Tiles are consistent; the intro block is a one-off. |
| A7 Phone | 1 | Not responsive: a cropped 980 px desktop layout. |
| A8 Plain path | 2 | With motion off the hero is still, but there is no text route to the work. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 4 | An artist's wall, maximal by intent. |
| B2 Composition | 2 | Everything shouts at once; there is no first thing after the hero. |
| B3 Colour | 2 | Electric blue #0000FF gutters plus every hue of the art; 8 colour families per screen. |
| B4 Type | 2 | Many unrelated faces. |
| B5 Image-making | 5 | The illustration and painting are strong and personal. |
| B6 Space | 1 | Same density from top to bottom. |
| B7 Finish | 3 | Tight gutters but uneven tile edges. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 2 | Video and GIFs move without any cause. |
| C2 Amount | 1 | 68 % of the screen moves while idle. |
| C3 Timing | 3 | Native scroll is fine; GIFs run at their own speed. |
| C4 Scroll | 3 | Plain scroll, nothing pinned. |
| C5 Feedback | 2 | Little hover feedback. |
| C6 Entrance | 3 | Title letters appear once over about 1.5 s. |
| C7 Rest | 1 | Never settles. |

**What makes it work**

1. **Electric-blue gutters as the frame.** All artworks sit in a 2 to 3 column masonry with about 16 px of pure #0000FF between them, so the blue becomes the 'wall' and the art does not need borders.
2. **Personal intro as a hand-made poster.** Screen 2 is a cream panel with "hi! i'm sahil betigeri" in big blue type and links written into the sentences ("Here you can see some of my WORK"), next to a portrait with stickers on it.

**What it avoids**: Avoids nothing; it is the example of maximal. Useful to Lana only as the upper bound of busy.

### 5. Rolan Gomes

UX Designer, India / UAE. https://rolangomes19.github.io/portfolio/

- Busyness at 1440 (7 stills): calm 1 % [0–15], busy 15 % [8–23], hues 3, saturation 37, luminance 62.
- Screens: 6.9. Fonts: 4 (Inter, Commissioner, IBM Plex Mono, Architects Daughter for handwriting). First screen: about 9 things (nav, avatar, 32 px headline, paragraph, 2 buttons, 5 sticky notes). Work visible on screen 1: none (5 sticky notes with results); screen 2 shows 4 project cards.
- Path to work: 1 scroll.
- Load: the cream paper card appears at 0.1 s; the five sticky notes slide up into place about 0.3 s later.
- Scroll: plain native scroll; 5 to 10 % residual change from small details; settles at once.
- Hover: buttons change by under 1 %.
- Drag: the brief says skill stickers are draggable, but a 300 px drag on a sticker moved nothing in our test.
- Idle: 0.5 %.
- Busyness note: median calm is 1 % only because the whole background is a green grid-paper texture, which the metric counts as detail; the cream column itself is calm.
- Phone: designed (column fills the width, sticky notes wrap 2-up).
- Project page (`/work/blueprint-design-system.html`): a long plain article (24.9 screens) with clear H2/H3 sections (Summary, Context, Foundations, Token architecture...).

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 5 | 'I design systems, then direct AI to build them into working software.' plus a role line and 2 buttons. |
| A2 Path to work | 4 | Featured work starts one scroll down. |
| A3 Orientation | 4 | Sticky top bar with Works / About me / Contact and a language switch. |
| A4 Reading | 4 | 16 px body on cream, dark text. |
| A5 Calm | 4 | One centred column with a single focus per screen (the grid texture is the only noise). |
| A6 Consistency | 4 | Project cards share layout, tags and mono metadata. |
| A7 Phone | 5 | Phone keeps the paper column and sticky notes. |
| A8 Plain path | 5 | Plain HTML pages; works with motion off. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 3 | Paper on a desk with sticky notes; carried lightly. |
| B2 Composition | 4 | Headline, then buttons, then notes. |
| B3 Colour | 4 | Deep green ground, cream paper, one blue project card. |
| B4 Type | 3 | Four families including a handwriting face. |
| B5 Image-making | 3 | Small stickers and screenshots; no single image world. |
| B6 Space | 3 | Same column density all the way down. |
| B7 Finish | 4 | Tidy column; sticky notes slightly overlap the card edge on purpose. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 4 | Only the sticky notes arrive; nothing else moves. |
| C2 Amount | 5 | Idle 0.5 %. |
| C3 Timing | 4 | Notes slide up in about 0.3 s. |
| C4 Scroll | 4 | Native scroll. |
| C5 Feedback | 3 | Weak hover states on buttons and cards. |
| C6 Entrance | 4 | Card then notes, once. |
| C7 Rest | 5 | Still after load. |

**What makes it work**

1. **A sheet of paper on a green desk.** A cream column about 650 px wide, centred on a dark green grid-paper background, holds all content; it reads as a document lying on a cutting mat.
2. **Results as handwritten sticky notes.** Five yellow-white notes (about 90 x 110 px each) overlap the bottom of the hero card at slight angles, each with one handwritten metric ("95 → 0 WCAG 2.1 violations").

**What it avoids**: No hero image, no illustration, no scroll effects, no idle motion, no custom cursor.

### 6. Harshini P Rajan

Graphic Designer, India. https://harshiniprajan-portfolio.figma.site/

- Busyness at 1440 (2 stills): calm 47 % [43–52], busy 32 % [31–32], hues 3.5, saturation 39, luminance 69.
- Screens: 1.4 (one hero plus a text list). Fonts: 1 (Suisse Intl). First screen: about 8 things (4 corner words, a 12-sided shape with a moving wave pattern, pill nav, list). Work visible: a text list of 8 project names under the hero.
- Path to work: 1 click on a list row.
- Load: about 1.5 s of flat orange, then the words and the 12-gon appear.
- Scroll: the page ends after 342 px; further wheel steps change nothing except the pattern.
- Hover: the hovered project row's title starts scrolling sideways like a ticker (marquee) while the pointer stays on it.
- Idle: 12.4 % (the wave pattern inside the 12-gon is always moving).
- Phone: not responsive; layout is 1280 px wide and overflows sideways.
- Project page (`/mco`): white page, pill nav, title at left, two-column metadata (Institution, Keywords, Guided by) and brief, then logo studies.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 3 | 'Hello! I am Harshini P Rajan.' fills the four corners; no role is stated. |
| A2 Path to work | 4 | A text list of 8 projects sits under the hero. |
| A3 Orientation | 3 | Pill nav at the top; inner pages have it too. |
| A4 Reading | 3 | List titles 13 px with 8 px tags. |
| A5 Calm | 3 | One shape, but it moves constantly. |
| A6 Consistency | 4 | Rows and tags are uniform. |
| A7 Phone | 1 | 1280 px layout overflows on a 390 px phone. |
| A8 Plain path | 3 | The list is plain text links. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 3 | A bold poster, but the idea does not continue inside. |
| B2 Composition | 4 | Shape first, name second, list third. |
| B3 Colour | 5 | Orange-red #E8402A and white only. |
| B4 Type | 4 | One grotesk at two sizes. |
| B5 Image-making | 3 | One abstract pattern; projects carry the imagery. |
| B6 Space | 3 | Loud panel, then a grey list; only two densities. |
| B7 Finish | 4 | Clean, aligned. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 2 | The pattern moves with no cause; the row ticker does have one. |
| C2 Amount | 2 | 12 % moving at rest. |
| C3 Timing | 3 | Ticker speed is steady; no easing to judge. |
| C4 Scroll | 2 | The page barely scrolls. |
| C5 Feedback | 4 | The row ticker is clear hover feedback. |
| C6 Entrance | 3 | Shape and words simply appear. |
| C7 Rest | 2 | Pattern never stops. |

**What makes it work**

1. **Name split into the four corners.** "Hello!" top left, "I am" top right, "Harshini" bottom left, "P Rajan." bottom right, each about 48 px white on an orange panel with 24 px rounded top corners.
2. **Ticker on hover.** A project row's title scrolls left continuously while hovered; the list itself is just text and thin rules.

**What it avoids**: No images on the home page except one pattern, no cards, no scroll story.

### 7. Shalmali Gaikwad

Motion Designer, India. https://meshmeadow.vercel.app/

- Busyness at 1440 (9 stills): calm 44 % [15–84], busy 8 % [1–30], hues 4, saturation 25, luminance 80.
- Screens: 8.4. Fonts: 3 (DM Sans, Cormorant Garamond italic, Agdasima condensed). First screen: 2 things (hot-air balloon with her 3D character, italic "making things move" over a sea of pink clouds). Name appears only in the footer.
- Path to work: 1 scroll.
- Load: a pink loader with her 3D character lying on a cloud and a counter "000" to "077" in the lower right, still loading at 3.5 s.
- Scroll: the full-bleed hero shrinks into a rounded card (scrubbed by scroll); then two rows of green campaign cards slide sideways in opposite directions; a "Visual Playground" title stays centred while cards float past at different speeds; residual change 7 to 23 % per step.
- Hover: nav links change 33 to 44 % of the screen because the clouds and marquees keep moving; the links themselves only underline.
- Idle: 28.7 % (clouds drift, marquees run).
- Phone: designed (hero becomes a tall card, sections stack).
- No project pages; everything is on the one page.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 3 | 'making things move' and a balloon say 'motion'; her name only appears at the bottom. |
| A2 Path to work | 4 | Campaign work starts one scroll down. |
| A3 Orientation | 3 | Small top nav with no current-section state. |
| A4 Reading | 4 | 16 px minimum. |
| A5 Calm | 3 | Hero is calm; the middle screens fill with moving cards (calm 15 to 84 %). |
| A6 Consistency | 4 | Card styles repeat per section. |
| A7 Phone | 4 | Designed phone hero card. |
| A8 Plain path | 3 | No text route to the pieces; it is a motion showreel by nature. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 4 | A dreamy sky where things float, fitting a motion designer. |
| B2 Composition | 4 | Each screen has a centred title and a field of cards. |
| B3 Colour | 4 | Pink and sky blue, with the work's greens. |
| B4 Type | 3 | Serif italic, sans and a condensed display face. |
| B5 Image-making | 4 | Her 3D character appears in hero, loader and footer. |
| B6 Space | 4 | Quiet hero, dense green grid, airy playground, pink footer. |
| B7 Finish | 4 | Scalloped footer edge and rounded cards are neat. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 3 | Hero shrink follows scroll; marquees and clouds run on their own. |
| C2 Amount | 2 | 29 % of the screen moves at rest. |
| C3 Timing | 4 | Hero shrink is smooth and tied to the wheel. |
| C4 Scroll | 4 | The hero card pulls back and cards float past; it feels like moving through sky. |
| C5 Feedback | 3 | Links only underline. |
| C6 Entrance | 3 | A counter loader before anything. |
| C7 Rest | 2 | Marquees never stop. |

**What makes it work**

1. **Full-bleed sky that shrinks into a card.** The first screen is pink cloud tops under a blue sky with a 3D character in a hot-air balloon at the left and a white serif italic line in the middle. Scrolling scales the whole scene down into a rounded card with a 1 px white border and a 24 px margin, so the hero becomes an object you leave behind.
2. **Floating playground.** A title stays at the centre while 6 to 8 cards (about 200 to 300 px) drift past at different speeds and slight angles, like objects floating in the sky.
3. **Scalloped pink footer.** The footer starts with a wavy edge, shows her character lying on a cloud and a huge condensed marquee "MAKING MOTION ✦ TELLING STORIES".

**What it avoids**: No project pages, no text-heavy sections, no dark mode.

### 8. Vibhor Mathur

Creative director and design leader (Razorpay), India. https://www.onlyvibhor.com/

- Busyness at 1440 (1 stills): calm 46 % [46–46], busy 18 % [18–18], hues 4, saturation 19, luminance 64.
- Screens: 1 (a 3D world in a canvas; the page does not scroll). Fonts: 3 (Inter, Inter Tight, DM Mono). First screen: about 12 things (dark side panel with avatar, 5 menu rows and 3 stat tiles, a key-hint row, a 95 px headline "A portfolio you can walk through.", and the island with billboards).
- Path to work: work is shown as billboards inside the world; the panel's 'About Vibhor' opens a modal with impact numbers in 1 click.
- Load: a dark loader "Vibhor Mathur / A portfolio you can walk through / Ready 100%".
- Scroll: none. The world is walked with WASD (keys shown in the panel: WASD walk, E interact, J journal, C camera).
- Hover: menu rows highlight (12 to 22 % change because the camera orbits behind them).
- Idle: 16 % (the camera slowly orbits the island).
- Walking: could not be verified headless. In two runs the loader overlay kept blocking clicks; in one run 'Enter the island' did not change the view within 3 s.
- Phone: stuck on "Waking the island 0%" in our test.
- About modal: dark panel, photo card left, 40 px headline "Designing narratives by day. Crafting emotions through art by night." with one word in green, and a grid of impact tiles (3, 10+, 4, 1→3, 81, Gold).

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 5 | Name, role, and 'A portfolio you can walk through.' plus a menu of five clear choices. |
| A2 Path to work | 3 | Work lives inside the world or behind modal clicks. |
| A3 Orientation | 4 | The panel is always on screen with five destinations and key hints. |
| A4 Reading | 4 | Large dark headline on a pale world; panel text white on charcoal. |
| A5 Calm | 3 | Panel, world and headline all compete at once. |
| A6 Consistency | 4 | Panel rows and modal tiles share one style. |
| A7 Phone | 1 | Phone stayed on 'Waking the island 0%'. |
| A8 Plain path | 3 | The panel and modals give a text route without walking. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 5 | A walkable island where each place is a part of his career. |
| B2 Composition | 4 | Headline, panel and world are ordered clearly. |
| B3 Colour | 4 | Pale green world, charcoal panel, one green accent. |
| B4 Type | 4 | Inter family with a mono for hints. |
| B5 Image-making | 4 | Consistent low-poly world. |
| B6 Space | 3 | One screen; no change of density. |
| B7 Finish | 4 | Neat panel and modal. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 3 | The orbit has no cause; the panel actions do. |
| C2 Amount | 3 | The whole world turns slowly at rest. |
| C3 Timing | 3 | Could not time the walk. |
| C4 Scroll | 2 | No scroll; travel needs the keyboard. |
| C5 Feedback | 4 | Menu rows highlight. |
| C6 Entrance | 3 | A loader, then the world. |
| C7 Rest | 3 | The camera never stops orbiting. |

**What makes it work**

1. **Fixed menu panel over a world.** A charcoal panel about 340 px wide with 16 px rounded corners floats over the left of the screen: avatar and name, five large menu rows (each a 48 px icon + title + one grey line; the first is bright green "Enter the island"), three stat tiles at the bottom, and a key-hint row. The world fills the rest.
2. **The headline sits in the world.** "A portfolio you can walk through." (about 95 px, near-black) is laid over the lower half of the island, as if painted on the landscape.

**What it avoids**: No scrolling page at all, no project grid on the first screen.

### 9. Natania Doshi

Visual Communication Designer, India. https://nataniadoshi.com/

- Busyness at 1440 (4 stills): calm 33 % [23–49], busy 29 % [21–32], hues 6, saturation 31, luminance 58.
- Screens: 3.4. Fonts: 2 (Inter Display, Spline Sans). First screen: 4 things (169 px purple name across the full width, one-line role, nav, illustrated scene). Work visible on screen 1: none; screen 2 shows 2 projects.
- Path to work: 1 scroll.
- Load: about 3 to 5 s of cream, then the illustrated scene rises into place from the bottom.
- Scroll: smooth scroll with easing (40 to 46 % of the screen still moving 1.2 s after the last wheel step, so each scroll glides on); the full nav collapses into a floating grey pill at the top centre after the hero.
- Hover: on a project image the cursor becomes a pale-blue dot about 12 px across; the card itself does not change.
- Idle: 2.3 %.
- Phone: designed (name in two lines, scene below, cards stack).
- Project page (`/work/deorhi`): full-bleed photo opener, a two-column brief (title with tag pills at left; Project / Insight / Approach / Outcome at right), then large photographs and spreads in the brand's own colours. 19.8 screens.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 5 | Her name at 169 px plus 'Visual designer building expressive brand systems...'. |
| A2 Path to work | 5 | Two projects one scroll down. |
| A3 Orientation | 4 | The nav becomes a floating pill that is always reachable. |
| A4 Reading | 4 | Large type; body at 14 to 16 px on cream. |
| A5 Calm | 3 | The hero illustration is detailed (busy 29 %); work screens hold one image each. |
| A6 Consistency | 4 | All project cards share title, year and tag pills. |
| A7 Phone | 5 | Designed phone. |
| A8 Plain path | 4 | Plain content under the motion. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 4 | An illustrated purple garden as her world; it stays in the hero, not inside the work. |
| B2 Composition | 5 | Name, then scene, then line. |
| B3 Colour | 4 | Cream ground, one purple, plus the art's colours. |
| B4 Type | 4 | Two sans faces; the giant name gives character. |
| B5 Image-making | 4 | The hero illustration is rich and well made. |
| B6 Space | 4 | Dense hero, then wide photo cards, then a flat purple footer. |
| B7 Finish | 5 | Exact grid and spacing. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 4 | The scene rises once; the nav reacts to scroll. |
| C2 Amount | 5 | Idle 2.3 %. |
| C3 Timing | 4 | Smooth scroll eases out over about 1 s. |
| C4 Scroll | 4 | Glide-style scroll, nothing pinned. |
| C5 Feedback | 3 | Only the cursor changes on cards. |
| C6 Entrance | 3 | Blank first, then the scene rises. |
| C7 Rest | 5 | Still after load. |

**What makes it work**

1. **Full-width name over an illustrated scene.** "NATANIA DOSHI" in purple (#4B3BAA approx.) set edge to edge at about 169 px across the top 20 % of the screen, one line of role text under it, and a flat-colour illustration of a flower garden on a purple checkerboard floor filling the lower 60 %.
2. **Nav that shrinks into a pill.** After the hero the nav becomes a light grey rounded pill (about 330 x 40 px) floating at the top centre with name and four links.
3. **Two-up then full-width project images.** Two 16:10 photos side by side, then one project full width; each has title at left and year and tag pills at right on one line below.

**What it avoids**: No animation in the work section, no custom effects on cards, no hover zoom.

### 10. Himanshu Shakit

Senior Product Designer, India. https://himanshushakit.com/

- Busyness at 1440 (9 stills): calm 22 % [18–44], busy 21 % [11–31], hues 6, saturation 24, luminance 53.
- Screens: 9.0 of scroll that drives a 3D scene. Fonts: 1 (Alan Sans) plus system. First screen: a rendered room (guitar, closed laptop on a desk, lamp, camera, resume on an acrylic stand, framed poster, window onto a pink cherry tree and a house), a "Scroll to open" pill, and five weather pills bottom left (Morning, Foggy, Rainy, Sunset, Night).
- Path to work: 2 scrolls (the laptop opens and fills the screen with the first case study).
- Load: a dark loader "Hey, I'm Himanshu" for more than 7 s on a cold load.
- Scroll: scrubbed camera move. The laptop lid opens, the camera pushes in until the screen fills the view, then case studies scroll inside the laptop screen; at the end the camera pans left to the resume stand. Residual change 8 to 35 % per step and 16 to 28 % still moving 1.2 s after the wheel stops (eased camera).
- Weather pills: 'Night' crossfades the whole room in about 1 to 2 s: dark blue sky, full moon, stars, lit window in the house, the desk lamp glowing warm. 'Sunset' and 'Rainy' change sky and light the same way.
- Idle: 0.0 %.
- Phone: blocked with "Rotate to view, best experienced on a laptop/desktop".
- Case studies open Figma prototypes.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 3 | A beautiful room, but the name only appears small on the resume stand. |
| A2 Path to work | 3 | Two scrolls to the first case study. |
| A3 Orientation | 3 | Weather pills and a logo; no section nav. |
| A4 Reading | 4 | Case text on the laptop is large and dark on white. |
| A5 Calm | 4 | Each scroll position shows one thing (room, then laptop, then resume). |
| A6 Consistency | 4 | Case cards on the laptop repeat one layout. |
| A7 Phone | 1 | Phone is blocked by a rotate message. |
| A8 Plain path | 2 | Case studies are Figma links; no plain page. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 5 | 'My desk by the window: open the laptop to see the work.' |
| B2 Composition | 4 | The camera always frames one object. |
| B3 Colour | 3 | Warm wood, pink blossom, sky; 6 colour families. |
| B4 Type | 4 | One sans family. |
| B5 Image-making | 5 | One coherent rendered room. |
| B6 Space | 3 | Room screens are rich throughout. |
| B7 Finish | 5 | Polished render and transitions. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 5 | Scroll opens the laptop and moves the camera; weather pills change the light. |
| C2 Amount | 4 | Idle 0.0 %; motion only when you scroll or click. |
| C3 Timing | 4 | Camera and lighting ease over about 1 to 2 s. |
| C4 Scroll | 5 | Scrolling is a camera journey across the desk. |
| C5 Feedback | 4 | Active weather pill fills. |
| C6 Entrance | 2 | More than 7 s of loader. |
| C7 Rest | 5 | Rests completely. |

**What makes it work**

1. **Scroll as a camera move into an object.** Scroll position drives the camera from a wide view of the room to a close-up of the laptop, whose screen then becomes the content area; the case studies (white cards with phone mockups at left and a 28 px title, paragraph and black 'Read Case Study' button at right) scroll inside it.
2. **Time-of-day switch.** Five small pills (Morning, Foggy, Rainy, Sunset, Night) at the bottom left relight the entire scene; Night adds a moon, stars, a lit house window and a glowing desk lamp, with a crossfade of about 1 to 2 s.
3. **Resume as an object.** The CV is printed on a clear acrylic stand on the desk; the camera ends on it.

**What it avoids**: No scrolling page of sections, no text hero, no idle animation, no cursor tricks.

### 11. Failenn Aselta

Product Designer, United States. https://www.failennaselta.com/

- Busyness at 1440 (4 stills): calm 63 % [48–68], busy 13 % [5–23], hues 4, saturation 3, luminance 81.
- Screens: 3.8. Fonts: 1 (Geist Mono) plus a script sign inside the collage image. First screen: a black-and-white photo collage island (waterfall, tree, rocks, money plant) with purple accents (a purple leopard, a purple portal, a purple sign "Product Designer + Code") and a small green-screened retro computer; pill nav at the top centre, 5 social icons at the left edge, "reset layout / show all" buttons, "scroll for projects or explore the collage". Work visible on screen 1: the tops of 2 project cards.
- Path to work: 1 scroll, or 1 click on the computer in the collage.
- Load: the page took 21.6 s to fire 'load' headless; the video recording stayed blank for its 7 s window.
- Scroll: plain native scroll (28 to 32 px per step, settles at once).
- Hover: the leopard shows a small "About" label; tiny bird and leaf animations.
- Click: the computer in the collage scrolls the page to the product-design cards; the cards show resize handles ("drag to rearrange and resize").
- Idle: 3.3 % (a bird and leaves).
- Phone: designed (collage scaled, cards one column).
- Project page (`/buddy`): left rail with section list (Project overview, The challenge, The research...), a video at top, then metric tiles ("64% found the layout intuitive"), sketches and decisions. 15.2 screens.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 4 | A purple sign in the collage says 'Product Designer + Code'; name in the pill nav. |
| A2 Path to work | 5 | Cards start at the bottom of screen 1. |
| A3 Orientation | 4 | Pill nav, breadcrumb 'work / product-design', left rail on case pages. |
| A4 Reading | 3 | Mono text at 8 to 14 px is small. |
| A5 Calm | 4 | One collage centred on a grey ground; calm 63 %, busy 13 %. |
| A6 Consistency | 5 | Cards share tags, title, line and metric chips. |
| A7 Phone | 4 | Designed phone. |
| A8 Plain path | 4 | Scroll alone reaches every project. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 5 | A jungle island collage where objects are doors: the computer opens work, the leopard opens About. |
| B2 Composition | 4 | Collage first, then sign, then cards. |
| B3 Colour | 5 | Grey and black-and-white with one purple. |
| B4 Type | 4 | One mono family. |
| B5 Image-making | 5 | The collage is carefully cut and toned. |
| B6 Space | 4 | Rich collage, then quiet cards. |
| B7 Finish | 4 | Clean cards; tiny type. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 5 | Things move when pointed at or clicked; the computer takes you to the work. |
| C2 Amount | 5 | Idle 3.3 % (one bird). |
| C3 Timing | 4 | Smooth scroll to the cards. |
| C4 Scroll | 4 | Native scroll. |
| C5 Feedback | 4 | Hover labels on collage objects; resize handles on cards. |
| C6 Entrance | 2 | Very slow cold load (21.6 s to load event). |
| C7 Rest | 5 | Still at rest. |

**What makes it work**

1. **Black-and-white collage with one accent colour.** The hero is a cut-out photo island about 1200 x 500 px on a light grey (#E8E8E8) ground. Everything is desaturated except a few purple objects (leopard, portal, sign) and one green computer screen, so the eye goes straight to the clickable things.
2. **Objects as navigation.** Pointing at an object shows a tiny label ("About"); clicking the computer scrolls to the product-design cards. The plain nav still exists for anyone who does not explore.
3. **Mono, small, quiet chrome.** One pill nav (about 800 x 56 px) with "home / work / contact", social icons stacked at the far left, and tiny caps hints ("drag to rearrange and resize").

**What it avoids**: No colour except the purple, no big type, no scroll effects, no loader animation.

### 12. Arshvardhan Bishnoi

Product Designer, India. https://oyearsh.vercel.app/

- Busyness at 1440 (11 stills): calm 68 % [36–83], busy 13 % [6–34], hues 4, saturation 6, luminance 13.
- Screens: 10.6. Fonts: 3 (VT323 pixel, Chivo Mono, Inter Tight). First screen: 6 things (pill nav, 2-line pixel headline, grey 3-line intro, 'View Missions' button, 'press tab to continue', two pixel-art fighters at the bottom on a starfield). Work visible on screen 1: none; missions start on screen 3.
- Path to work: 2 scrolls or 1 click (View Missions).
- Load: a 'LOADING...' bar for about 1 s; the nav grows from a small pill to full width; the headline types itself letter by letter in about 1 s; then still.
- Scroll: plain native scroll; near the bottom a strip of personal photos and tool icons runs sideways (15 to 23 % residual, still moving after the wheel stops).
- Hover: nav and buttons change by 0.1 %.
- Idle: 0.1 %.
- Phone: designed (same sections, single column).
- Case studies: 'View Case Study' buttons on each mission card.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 5 | 'Welcome, this is Arshvardhan Bishnoi.' with a 3-line intro and one button. |
| A2 Path to work | 3 | Missions start on screen 3. |
| A3 Orientation | 4 | Pill nav with Player / Missions / Record / Contact on every screen. |
| A4 Reading | 3 | Mono 10 to 12 px grey on near-black. |
| A5 Calm | 4 | Each screen has one card or title; calm 68 %. |
| A6 Consistency | 5 | Mission cards repeat exactly: title chip, image, stats, button. |
| A7 Phone | 4 | Designed phone. |
| A8 Plain path | 4 | All content is plain text and images. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 4 | A video game: player profile, missions, record, loadout. |
| B2 Composition | 4 | Pixel title, then cards. |
| B3 Colour | 4 | Near-black with each project's own colour inside its card. |
| B4 Type | 3 | Three faces; pixel display has character. |
| B5 Image-making | 3 | Pixel sprites, anime portrait and phone photos mix. |
| B6 Space | 4 | Starfield hero, dense card stack, sparse loadout, photo strip. |
| B7 Finish | 4 | Tidy borders and labels. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 4 | Typing headline once; nothing else moves on its own. |
| C2 Amount | 5 | Idle 0.1 %. |
| C3 Timing | 4 | Typing about 1 s; load bar about 1 s. |
| C4 Scroll | 3 | Native scroll; one photo marquee near the end. |
| C5 Feedback | 2 | Hover feedback is barely visible. |
| C6 Entrance | 4 | Load bar, nav grows, headline types, once. |
| C7 Rest | 5 | Rests after the intro. |

**What makes it work**

1. **Game vocabulary for sections.** Section labels read "LEVEL 01 / ABOUT", "THE PLAYER.", "THE MISSIONS.", "THE LOADOUT.", "THE RECORD." in a pixel face, which gives a plain list of sections a story without extra graphics.
2. **Typed headline.** The 2-line headline appears one letter at a time in about 1 s and then stays.
3. **Mission cards.** Each project is a bordered dark card: a title chip at top left, a large product photo at left, and at right a short line and two big numbers ("₹2.33 Cr", "6.5x").

**What it avoids**: No idle animation, no parallax, no scroll-jacking, no illustration beyond two small sprites.

### 13. Shashank Khambhaita

Product Designer, India (from the Interactive page). https://shashankdesign.netlify.app/

- Busyness at 1440 (1 stills): calm 8 % [8–8], busy 41 % [41–41], hues 6, saturation 43, luminance 27.
- Screens: 1 (a single pixel-art room; no scroll). Fonts: 2 (PP Editorial New, Satoshi). First screen: one painted room (boy at a desk with laptop and steaming mug, window onto a city with purple jacaranda trees, bookshelves, arcade cabinet, posters, neon "Do What Excites!", backpack), a live clock top right, a bottom pill nav (Work, About, Contact), and a hint "Slide over the board to explore...".
- Path to work: 1 click (the backpack or Work) to project cards; 2 clicks to a project.
- Load: a dark screen with three dots for about 5 s, then the room fades in.
- Scroll: none.
- Hover: an object gets a thin amber rounded outline within 100 ms and a small caption ("Peek inside the bag, my work travels with me", "Peek at my screen, this is me →"); hovering the window sends a plane and a flock of birds across the sky.
- Click: the camera zooms into the object (about 400 ms), then the page changes. Backpack opens an orange page "Work travels with me." with 2 project cards, a zipper along the top edge and a "← zip out" button. Laptop opens a corkboard About page with pinned notes and photos and "← back to the room".
- Idle: 5 % (clock, steam, birds, arcade screen).
- Phone: the room is cropped to the boy and window with the nav pill.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 3 | Neon 'Do What Excites!' and a room; the name is not on screen. |
| A2 Path to work | 3 | Work is behind the backpack: 1 click to cards, 2 to a project. |
| A3 Orientation | 4 | Bottom pill nav marks the active page in amber; inner pages have 'back to the room'. |
| A4 Reading | 3 | Captions are small; inner pages are readable. |
| A5 Calm | 2 | Every corner of the room is detailed (calm 8 %, busy 41 %). |
| A6 Consistency | 4 | Hover outline and caption behave the same on every object. |
| A7 Phone | 3 | Phone crops the room to the centre. |
| A8 Plain path | 3 | The nav pill is a plain route. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 5 | 'My room': each object is a page (bag = work, laptop = about). |
| B2 Composition | 3 | The boy and window lead, but the room is busy. |
| B3 Colour | 3 | Warm browns with purple jacaranda and blue sky. |
| B4 Type | 4 | An editorial serif and one sans. |
| B5 Image-making | 5 | One consistent pixel-art world. |
| B6 Space | 4 | Dense room, then flat orange or corkboard pages. |
| B7 Finish | 4 | Neat outlines and captions. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 5 | Hover and click both explain the object and take you inside it. |
| C2 Amount | 3 | Small idle motions in four places. |
| C3 Timing | 4 | Outline in 100 ms; zoom about 400 ms. |
| C4 Scroll | 1 | No scroll at all. |
| C5 Feedback | 5 | Amber outline plus caption on every object. |
| C6 Entrance | 3 | Dots loader, then a fade. |
| C7 Rest | 4 | Mostly still apart from small loops. |

**What makes it work**

1. **Room as menu.** One illustrated room fills the screen. Each object that leads somewhere (backpack, laptop, arcade, window) shows a 1 px amber rounded rectangle around it on hover plus a one-line caption in a small dark pill, so you learn the map by pointing.
2. **Zoom into the object, then a themed page.** Clicking zooms the camera into the object (about 400 ms) and lands on a page styled like the inside of that object: the backpack page is orange with a zipper edge and a "zip out" back button; the laptop page is a corkboard.
3. **Small 'alive' details.** A live clock pill top right, steam from the mug, a plane and birds when you point at the window.

**What it avoids**: No scrolling, no text hero, no grid of thumbnails on the home screen.

### 14. Oorja Kapoor

Product and Brand Designer, India (from the Interactive page). https://oorjakapoor.com/

- Busyness at 1440 (5 stills): calm 52 % [45–80], busy 23 % [5–25], hues 5, saturation 59, luminance 32.
- Screens: 2.2 of document, but the wheel drives a pinned scene. Fonts: 5 (Open Sans, Mountains of Christmas, Lacquer, Nunito Sans, a serif). First screen: a painted sunset sky with her and two dogs standing on a rock, name small at the bottom. Work visible: none.
- Path to work: 1 scroll and 1 click on the "Work" card, or the Work icon top right.
- Load: about 1.5 s of dark navy, then the painting fades in with a few sparkles.
- Scroll: the first wheel zooms out from her to a whole mountain with a dotted trail; the scene then pins. Each further wheel step moves a white star marker up the trail and swaps a destination card at bottom right (About, Play, Resume, Work, each with an object: peace-sign hand, tennis ball, folded paper, card); after Work it loops back to About. The page stays at 1080 px.
- Hover: the destination card brightens; small change (5 to 10 %).
- Idle: 0.1 %.
- Phone: designed (painting cropped portrait, card at the bottom).
- Work page: dark ground, "Selected work" in orange serif, numbered projects with a "View project" button and a horizontal strip of images; ends in a giant blurred "End Scene" title on an orange glow.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 4 | 'I take design seriously. The play even more so.' plus 'Product & visual designer, India'. |
| A2 Path to work | 4 | A Work card is reached on the first wheel steps. |
| A3 Orientation | 3 | The star on the trail shows where you are, but the loop is confusing. |
| A4 Reading | 3 | Thin white serif over a busy sky. |
| A5 Calm | 3 | One mountain and one card, but a busy painted sky. |
| A6 Consistency | 4 | Destination cards are identical in form. |
| A7 Phone | 4 | Designed phone crop. |
| A8 Plain path | 3 | The wheel is captured in a loop; Work icon top right is the escape. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 5 | 'The climb': a trail up a mountain, each stop a section. |
| B2 Composition | 4 | Mountain, headline, card. |
| B3 Colour | 3 | Saturated orange and blue (saturation 59). |
| B4 Type | 2 | Five families including two novelty faces. |
| B5 Image-making | 5 | The paintings are consistent and strong. |
| B6 Space | 3 | Every state is the same painted scene. |
| B7 Finish | 4 | Clean overlays. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 5 | Each scroll step moves you up the trail and changes the destination. |
| C2 Amount | 4 | Idle 0.1 %. |
| C3 Timing | 4 | Marker and card swap ease in about 0.4 s. |
| C4 Scroll | 3 | Feels like climbing, but the wheel loops instead of ending. |
| C5 Feedback | 4 | Cards brighten on hover. |
| C6 Entrance | 4 | Dark, then the painting fades in once. |
| C7 Rest | 5 | Still between steps. |

**What makes it work**

1. **Scroll as a climb.** After the opening zoom-out, one painted mountain fills the screen with a dotted white path from bottom left to the summit. A small white star sits on the path; each wheel step moves it to the next stop and swaps a dark card at the bottom right (about 280 x 80 px) showing the destination name in 40 px serif with an arrow and a small photographed object.
2. **Zoom-out opener.** The first screen is a close view of her on a rock; the first scroll pulls the camera back to reveal the mountain, which tells you a journey is starting.

**What it avoids**: No scrolling sections on the home page, no grid of work, no nav bar.

### 15. Madhur Rastogi

Product Designer, India (from the Interactive page). https://madhurr.framer.website/

- Busyness at 1440 (14 stills): calm 65 % [34–85], busy 11 % [4–18], hues 4, saturation 6, luminance 84.
- Screens: 18.8. Fonts: 3 (Inter Display, Inter, Manrope). First screen: a painted aerial valley with a river and clouds (anime style) filling the screen, giant white "Madhur" at the top left (about 200 px), a 3-line tagline at the bottom left, a 'Resume' pill top right and a 'Menu' pill bottom centre.
- Path to work: 3 scrolls (first project on screen 4).
- Load: a white loader in which "Madhur Rastogi / Product Designer" writes itself, for more than 7 s on a cold load.
- Scroll: after the painted hero the page turns white; project cards pin and stack (each new card slides up over the last); a ring of tool icons rotates as you scroll (scrubbed). Smooth scroll: 25 % of the screen still moving 1.2 s after the wheel stops.
- Hover: 'Resume' pill and Framer badge cause large changes (36 % and 22 %), so the hero reacts to the pointer as well.
- Idle: 0.0 %.
- Phone: designed, but the painted hero is replaced by a plain white name screen.
- Project page (`/work-vedaai`): centred 48 px title on an orange-to-white gradient with a phone mockup, a left rail of sections (Overview, Problem...), and highlighted phrases in orange in the body. 37 screens.

**Interface**

| Criterion | Score | Evidence |
|---|---|---|
| A1 First screen | 4 | Huge name over the valley with 'Building digital experiences that just make sense.' |
| A2 Path to work | 2 | First project on screen 4. |
| A3 Orientation | 3 | A 'Menu' pill only. |
| A4 Reading | 4 | Large type; body 20 px minimum. |
| A5 Calm | 4 | Each screen has one card or one line. |
| A6 Consistency | 4 | Stacked cards share one layout. |
| A7 Phone | 3 | Phone loses the painted hero. |
| A8 Plain path | 3 | Plain content, but a long loader first. |

**Visual design**

| Criterion | Score | Evidence |
|---|---|---|
| B1 Idea | 2 | The painted valley is only the hero; the rest is glossy white Framer. |
| B2 Composition | 4 | One big thing per screen. |
| B3 Colour | 4 | White ground, gradients per project. |
| B4 Type | 3 | Three sans faces. |
| B5 Image-making | 3 | Painting, glossy gradients and 3D icons do not match. |
| B6 Space | 4 | Painted hero, quiet white sections, dense icon ring. |
| B7 Finish | 4 | Neat cards. |

**Motion**

| Criterion | Score | Evidence |
|---|---|---|
| C1 Purpose | 3 | Scrubbed stacking and ring rotation follow scroll. |
| C2 Amount | 3 | Stacking and ring move together at times. |
| C3 Timing | 4 | Eased. |
| C4 Scroll | 3 | Smooth scroll lags the wheel by about 1 s. |
| C5 Feedback | 4 | Pills react strongly on hover. |
| C6 Entrance | 2 | More than 7 s of loader. |
| C7 Rest | 4 | Idle 0.0 %. |

**What makes it work**

1. **Painted landscape hero with giant name.** A full-bleed painted aerial valley (river, terraced fields, clouds) with the name in white at about 200 px across the top left and a small tagline at the bottom left; the only controls are two small dark pills.
2. **Stacking project cards.** Each project card (full width minus 16 px margin, rounded 24 px) pins at the top while the next slides up over it, so projects pile like a deck.

**What it avoids**: Avoids text-heavy sections near the top; little else.

## Across the 15 sites

### Median score per criterion

| Criterion | Median | Lowest | Highest |
|---|---|---|---|
| A1 First screen | 4 | 3 (Sahil, Harshini, Shalmali, Himanshu, Shashank) | 5 (Royden, Rolan, Vibhor, Natania, Arshvardhan) |
| A2 Path to work | 4 | 2 (Madhur) | 5 (Royden, Natania, Failenn) |
| A3 Orientation | 4 | 2 (Sahil) | 4 (Royden, Loveleen, Rolan, Vibhor, Natania, Failenn, Arshvardhan, Shashank) |
| A4 Reading | 3 | 2 (Loveleen) | 4 (Royden, Rolan, Shalmali, Vibhor, Natania, Himanshu, Madhur) |
| A5 Calm | 3 | 1 (Sahil) | 5 (Royden) |
| A6 Consistency | 4 | 3 (Sahil) | 5 (Royden, Failenn, Arshvardhan) |
| A7 Phone | 4 | 1 (Sahil, Harshini, Vibhor, Himanshu) | 5 (Royden, Rolan, Natania) |
| A8 Plain path | 3 | 2 (Sahil, Himanshu) | 5 (Rolan) |
| B1 Idea | 4 | 2 (Madhur) | 5 (Rezwanul, Loveleen, Vibhor, Himanshu, Failenn, Shashank, Oorja) |
| B2 Composition | 4 | 2 (Sahil) | 5 (Royden, Natania) |
| B3 Colour | 4 | 2 (Sahil) | 5 (Harshini, Failenn) |
| B4 Type | 3 | 2 (Sahil, Oorja) | 4 (Royden, Harshini, Vibhor, Natania, Himanshu, Failenn, Shashank) |
| B5 Image-making | 4 | 3 (Rolan, Harshini, Arshvardhan, Madhur) | 5 (Royden, Sahil, Himanshu, Failenn, Shashank, Oorja) |
| B6 Space | 4 | 1 (Sahil) | 5 (Royden) |
| B7 Finish | 4 | 3 (Sahil) | 5 (Royden, Natania, Himanshu) |
| C1 Purpose | 4 | 2 (Sahil, Harshini) | 5 (Himanshu, Failenn, Shashank, Oorja) |
| C2 Amount | 4 | 1 (Sahil) | 5 (Rezwanul, Rolan, Natania, Failenn, Arshvardhan) |
| C3 Timing | 4 | 3 (Sahil, Harshini, Vibhor) | 4 (Rezwanul, Royden, Loveleen, Rolan, Shalmali, Natania, Himanshu, Failenn, Arshvardhan, Shashank, Oorja, Madhur) |
| C4 Scroll | 3 | 1 (Shashank) | 5 (Himanshu) |
| C5 Feedback | 4 | 2 (Rezwanul, Sahil, Arshvardhan) | 5 (Loveleen, Shashank) |
| C6 Entrance | 3 | 2 (Loveleen, Himanshu, Failenn, Madhur) | 4 (Rezwanul, Royden, Rolan, Arshvardhan, Oorja) |
| C7 Rest | 5 | 1 (Sahil) | 5 (Rezwanul, Royden, Rolan, Natania, Himanshu, Failenn, Arshvardhan, Oorja) |

### Summary per site

| Site | Calm med | Busy med | A5 Calm | B6 Space | C2 Amount | C4 Scroll | A total /40 | B total /35 | C total /35 |
|---|---|---|---|---|---|---|---|---|---|
| Rezwanul Choudhury | 54 | 18 | 3 | 3 | 5 | 2 | 27 | 26 | 26 |
| Royden So | 70 | 7 | 5 | 5 | 4 | 4 | 37 | 32 | 28 |
| Loveleen Pereira | 69 | 8 | 3 | 4 | 4 | 3 | 27 | 28 | 26 |
| Sahil Betigeri | 21 | 44 | 1 | 1 | 1 | 3 | 19 | 19 | 15 |
| Rolan Gomes | 1 | 15 | 4 | 3 | 5 | 4 | 35 | 24 | 29 |
| Harshini P Rajan | 47 | 32 | 3 | 3 | 2 | 2 | 24 | 26 | 18 |
| Shalmali Gaikwad | 44 | 8 | 3 | 4 | 2 | 4 | 28 | 27 | 21 |
| Vibhor Mathur | 46 | 18 | 3 | 3 | 3 | 2 | 27 | 28 | 21 |
| Natania Doshi | 33 | 29 | 3 | 4 | 5 | 4 | 34 | 30 | 28 |
| Himanshu Shakit | 22 | 21 | 4 | 3 | 4 | 5 | 24 | 29 | 29 |
| Failenn Aselta | 63 | 13 | 4 | 4 | 5 | 4 | 33 | 31 | 29 |
| Arshvardhan Bishnoi | 68 | 13 | 4 | 4 | 5 | 3 | 32 | 26 | 27 |
| Shashank Khambhaita | 8 | 41 | 2 | 4 | 3 | 1 | 25 | 28 | 25 |
| Oorja Kapoor | 52 | 23 | 3 | 3 | 4 | 3 | 28 | 26 | 29 |
| Madhur Rastogi | 65 | 11 | 4 | 4 | 3 | 3 | 27 | 24 | 23 |

### Shared by the sites scoring 4 or more on A5, B6 and C2

Sites: Royden So, Failenn Aselta, Arshvardhan Bishnoi. Natania Doshi, Himanshu Shakit and Rolan Gomes miss by one point on one of the three.

1. **One hero object or scene, with a wide empty ground around it.** Royden's held card on near-black, Failenn's collage island on flat grey, Arsh's two sprites at the bottom of a starfield. The object covers 30 to 50 % of the first screen; the rest is a single flat colour.
2. **One dominant ground colour per page, and one accent.** Royden: #080C0D and white, colour only in photographs. Failenn: #E8E8E8 and black-and-white, purple only on clickable things. Arsh: near-black, project colours only inside cards. Saturation medians are 3 to 13.
3. **Motion happens on load or under the pointer, then stops.** Idle change is 0.0 to 3.3 % on all three (Royden's hero card video is the one exception, and it shows work). No marquees on the first screen, no ambient loops behind text.
4. **Native scroll.** All three scroll 1:1 with the wheel and settle at once. None pins the hero or hijacks the wheel.
5. **The work sits in identical cards.** Every project uses the same frame, title position and metadata (Royden: title, one line, 'Learn More'; Failenn: tags, title, line, metric chips; Arsh: title chip, photo, two numbers, button).
6. **A rich first screen, then quiet repetition.** The hero carries all the illustration or photography; the screens after it are cards on plain ground.
7. **One type family plus at most one display accent.** Royden: one serif in two widths. Failenn: Geist Mono only. Arsh: Inter Tight with VT323 for titles.
8. **Small pill or bar nav that is always there.** Thin top bar (Royden), centred pill (Failenn, Arsh); none takes more than 56 px.

### What the 'world' sites teach (the ones nearest Lana's taste)

- **Objects as doors work when the plain route also exists.** Failenn (computer → work, leopard → About) and Shashank (bag → work, laptop → About) both keep a normal nav. Failenn scores 5 on path to work; Shashank, without a name or text on the first screen, scores 3.
- **Hover must explain the object.** Shashank's amber outline plus one-line caption within 100 ms is the clearest pattern seen: it teaches the map by pointing.
- **Travel on scroll works best as a camera move with an end.** Himanshu's push-in to the laptop and pan to the resume reads as a journey and rests at 0.0 % idle. Oorja's climb loops back to the start and captures the wheel, which feels stuck.
- **Night as a switch, not the default.** Himanshu's Night pill relights the same scene (moon, stars, lit lamp, lit window) in about 1 to 2 s; the day scene stays the default for reading.
- **Painted heroes lose force when the rest of the site drops the world.** Madhur and Natania put the painting only in the hero; the inside pages are generic. Shashank carries the world into the inner pages (zipper edge on the bag page, corkboard on About).
- **Long loaders cost the most.** Himanshu, Madhur and Loveleen show nothing useful for 7 s or more on a cold load; Failenn took 21.6 s to fire 'load'. The best entrances (Royden, Arsh, Rolan) show content within about 1 s and animate only one element.

## What could not be checked

- **Vibhor Mathur's walk mode.** Headless Chrome could not get past the loader overlay into the walkable view (screenshot timeouts with WebGL; clicks blocked by `#loader`). The panel, About modal and orbit were checked; walking, interaction keys and the journal were not. On the phone it stayed at "Waking the island 0%".
- **Filters by Designation, Experience and Country**: login-gated; not used.
- **The Minimalist category (540 sites)** was listed but not scanned visually.
- **Cold-load times** are from headless Chrome on one connection; loaders may be shorter on a warm cache or a real GPU.
- **Touch gestures on phones** (canvas drag on Rezwanul, polaroid drag on Loveleen) were not tested; phone checks are stills only.
- **Project pages not opened**: Sahil Betigeri and Shalmali Gaikwad have none; Arshvardhan Bishnoi's 'View Case Study' and Himanshu Shakit's Figma prototypes were not opened. Vibhor Mathur's work lives inside the world.
- **Rolan Gomes' sticker drag**: a 300 px drag moved nothing; it may need a touch or a different handle.
- Some captures (Sahil, Himanshu) crashed or timed out when run in parallel and were re-run on their own.
