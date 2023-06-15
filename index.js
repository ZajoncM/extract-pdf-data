const fs = require("fs");
const pdfparse = require("pdf-parse");
const axios = require("axios");

const headers = {
  Authorization: "Bearer apiKey",
  "Content-Type": "application/json",
};

(async () => {
  const pdf = fs.readFileSync("cv/example3.pdf");

  const parsedPDF = await pdfparse(pdf);

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `get valuable information and send in JSON (format keys: englishLevel (string), cityOfLiving (string), age (number), studies (array of strings), githubProfile (string), skills (array of strings), personalWebsite (string)) without any comments:
    - english level
    - city of living
    - age
    - studies (2nd year of studies / 4 years after studies etc.)
    - github profile
    - skill written in CV (i.e. Technologies)
    - personal website
    
    from the cv below:
    '${parsedPDF.text}'`,
      },
    ],
  };

  axios
    .post("https://api.openai.com/v1/chat/completions", data, { headers })
    .then((response) => {
      const json = JSON.parse(response.data.choices[0].message.content);
      console.log(json);
    });
})();
