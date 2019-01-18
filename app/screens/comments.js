import React from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { f, auth, database, storage } from "../../config/config";

export default class upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        //logged in
        that.setState({
          loggedIn: true
        });
      } else {
        //not logged in
        that.setState({
          loggedIn: false
        });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {this.state.loggedIn === true ? (
          <Text>Comments</Text>
        ) : (
          <View>
            <Text>You are not logged in.</Text>
            <Text>Please login to post a comment.</Text>
          </View>
        )}
      </View>
    );
  }
}
