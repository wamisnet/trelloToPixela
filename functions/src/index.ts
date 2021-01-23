import * as functions from 'firebase-functions';
import Pixela from "./pixela";
const pixela = new Pixela(functions.config().pixela.userid,functions.config().pixela.graphid,functions.config().pixela.token)
export const trelloWebhook = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
  functions.logger.info("body json",JSON.stringify(request.body));
  const body = request.body;
  if(body && body.action && body.action.data && body.action.data.card && body.action.data.listAfter && body.action.data.listAfter.name){
    if(body.action.data.listAfter.name === "完了"){
      functions.logger.info("card name",body.action.data.card.name );
      if(await pixela.incrementGraph()){
        functions.logger.info("pixela success");
        response.send("api success finish");
        return;
      }
      functions.logger.info("pixela failed");
      response.send("api error finish");
      return;
    }
    response.send("list no match finish");
    return;
  }
  response.send("no body or no body.action");
});
