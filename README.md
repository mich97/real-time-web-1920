# RTW1920 | Marvel Quiz
First concept of my real-time application. The idea is to create a Kahoot like quiz game where the Marvel API is used to retrieve certain data. Players will be able to sign in, when the quiz starts it shall display a Marvel character. The players will have to guess the Marvel character, this will probably be multiple choice.

## Install
Follow the steps beneath to run this app locally.
1. Clone repo
    ```
    $ git clone https://github.com/mich97/real-time-web-1920.git
    ```
2. Move to directory
    ```
    $ cd real-time-web-1920/quiz-app
    ```
3. Install dependencies
    ```
    $ npm install
    ``` 
4. Run
    ```
    $ npm run dev
    ```
5. Open following url in browser
    ```
   localhost:3000
   ```

## Features
- Multiplayer quiz, probably multiple choice
- Display list of participating users
- Achieve points based on answer and speed
- Display score during quiz
- Display leaderboard at end

## API
This web-app was made by making use of the Marvel API. The Marvel API allows developers everywhere to access information about Marvel's vast library of records what's coming up, to 70 years ago, 3000 calls can be made daily. Documentation can be found [here](https://developer.marvel.com/docs).

To fetch server side the API requires a md5 hash consisting of a timestamp, public key and private key.

In our case only the characters are used for the application. The provided object can be seen below, it has been mapped to only get certain properties.
```
"results": [
  {
    "id": "int",
    "name": "string",
    "description": "string",
    "modified": "Date",
    "resourceURI": "string",
    "urls": [
      {
        "type": "string",
        "url": "string"
      }
    ],
    "thumbnail": {
      "path": "string",
      "extension": "string"
    }
  }
]
```

## Data Life Cycle
![DLC](./course/data-life-cycle-v2.png)