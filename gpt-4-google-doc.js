var ui = DocumentApp.getUi();
var userProperties = PropertiesService.getUserProperties();

var API_KEY = userProperties.getProperty('api.key');

function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('GPT-4')
    .addItem('Generate Text', 'generateText')
    .addItem('Set API key', 'setKey')
    .addItem('Delete API key', 'resetKey')
    .addItem('Delete all credentials', 'deleteAll')
    .addToUi();
}

function setKey(){
  var scriptValue = ui.prompt('Please provide your API key.' , ui.ButtonSet.OK);
  userProperties.setProperty('api.key', scriptValue.getResponseText());
  API_KEY = userProperties.getProperty('api.key');
}

function resetKey(){
  userProperties.deleteProperty(API_KEY);
}

function deleteAll(){
  userProperties.deleteAllProperties();
}

function generateText() 
{
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const prompt = doc.getSelection().getRangeElements()[0].getElement().asText().getText();

  const url = "https://api.openai.com/v1/chat/completions";
  const data = {
    model: 'gpt-4',
    messages: [{role: "user", content: prompt}],
    temperature: 0,
    max_tokens: 2000
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer "+API_KEY
    },
    payload: JSON.stringify(data)
  };

  const response = UrlFetchApp.fetch(url, options);
  const jsonResponse = JSON.parse(response.getContentText());
  const generatedText = jsonResponse['choices'][0]['message']['content'];
  body.appendParagraph(generatedText.toString());
}
