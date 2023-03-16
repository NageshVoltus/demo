const { Kafka } = require("kafkajs");
const updateApiSendMessage = require('../module/user/updateApiSendMessage')
const request = require("request-promise");
module.exports = async (configParams, serviceList) => {
  const kafka = new Kafka({
    clientId: "my-app",
    brokers: [configParams.kafka.brokerlist],
  });



  const openApiConsumer = kafka.consumer({
    groupId: configParams.openApiGroupId,
  });

  // Consuming

  await openApiConsumer.connect();
  console.log("openApiConsumer Connected..................!");
  await openApiConsumer.subscribe({
    topic: configParams.openApiReservationsNotificationLogTopic,
    fromBeginning: true,
  });

  await openApiConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("consume = ", message.value.toString());
      const openApiNotification = JSON.parse(message.value.toString());
      console.log("openApiNotificationobj =",openApiNotification)
      const options = {
        method: "POST",
        url: openApiNotification.endpoint,
        body: {
          reservationId: openApiNotification.ReservationId,
          messageId: openApiNotification.MessageId
        },
        json: true,
        headers: {
          "Content-Type": "application/json",
        },
      };

      request(options)
        .then((response) => {
          console.log("res.........",response)
          console.log("send success");
          let notificationParams = {
            ReservationId: openApiNotification.ReservationId,
            MessageId: openApiNotification.MessageId,
            SyncStatusId:1,
            ClientResponse:"",
            ClientConfirmationNumber:""

          }
          updateApiSendMessage(configParams, notificationParams,function(){})

        })
        .catch((exception) => {
          console.log("send failed", exception);
        });
    },
  });

  return true;
};
