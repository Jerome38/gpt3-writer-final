import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const LanguageDetect = require("languagedetect");

const generateAction = async (req, res) => {
  // Get language
  const lngDetector = new LanguageDetect();
  const lng = lngDetector.detect(req.body.userInput, 1)[0][0];

  console.log(lng);
  const basePromptPrefix =
    "Write me an " +
    `${req.body.type}` +
    " answer to this e-mail. Always say hello and goodbye and by very polite. Don't sign at the end. Always add a line break after hello and before goodbye.  Answer in " +
    lng +
    ". Email content : ";
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();
  // add language detection at the beginning of the output
  basePromptOutput.text =
    "Detected lang:" + lng + "\n\n" + basePromptOutput.text;

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
