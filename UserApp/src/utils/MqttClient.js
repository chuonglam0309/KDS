  import { Alert } from 'react-native';
  import initialize from '../../lib';

  initialize();
  class MqttClient {
    constructor() {
      function makeid() 
        {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      }
      this.client = new Paho.MQTT.Client('14.225.192.41', 9002, makeid());
      this.client.onMessageArrived = this.onMessageArrived;
      this.callbacks = {};
      this.onSuccessHandler = undefined;
      this.onConnectionLostHandler = undefined;
      this.isConnected = false;
      this.last_will = new Paho.MQTT.Message("disconnect");
      this.last_will.destinationName = "undefined";
    }

    onConnect = (onSuccessHandler, onConnectionLostHandler) => {
      this.onSuccessHandler = onSuccessHandler;
      this.onConnectionLostHandler = onConnectionLostHandler;
      this.client.onConnectionLost = () => {
        this.isConnected = false;
        onConnectionLostHandler();
      };

      this.client.connect({
        timeout: 10,
        onSuccess: () => {
          this.isConnected = true;
          onSuccessHandler()
        },
        useSSL: false,
        onFailure: this.onError,
        reconnect: true,
        keepAliveInterval: 20,
        cleanSession: true,
        willMessage:this.last_will
      });
    };

    onError = ({errorMessage}) => {
      this.isConnected = false;
      Alert.alert('Failed', 'Failed to connect to MQTT', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Try Again',
          onPress: () =>
            this.onConnect(
              this.onSuccessHandler,
              this.onConnectionLostHandler,
            ),
        },
      ]);
    };

    // onMessageArrived = message => {
    //   // const payloadString = message.payloadString;
    //   // const topic = message.topic;
    //   const {payloadString, topic} = message;
    //   // console.log('onMessageArrived:', payloadString);
    //   this.callbacks[topic](payloadString,topic);

    //   // this.callbacks[topic](payloadString,topic);        
      
    // };
    onMessageArrived = message => {
      const { payloadString, topic, retained } = message;
      if (!retained) {
        this.callbacks[topic](payloadString, topic);
      }
    };
    

    onPublish = (topic, message ) => {
      this.client.publish(topic, message );
    };

    onSubscribe = (topic, callback) => {
      this.callbacks[topic] = callback;
      this.client.subscribe(topic, { qos: 1 });
    };

    unsubscribe = topic => {
      delete this.callbacks[topic];
      this.client.unsubscribe(topic);
    };
    disconnect (){
    this.client.disconnect();
    }
    Isconnect (){
      return this.isConnected 
      }
  }

  let client = new MqttClient();
  export {client as MqttClient};
