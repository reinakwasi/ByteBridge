// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import axios from 'axios';
// // import { BACKEND_URL } from '../../env';

// const HistoryScreen = ({ navigation }) => {
//   const [selectedTab, setSelectedTab] = useState('Sent');
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchHistory();
//   }, [selectedTab]);

//   const fetchHistory = async () => {
//     setLoading(true);
//     try {
//       // const endpoint = selectedTab === 'Sent' ? `${BACKEND_URL}/history/sent` : `${BACKEND_URL}/history/received`;
//       // const response = await axios.get(endpoint);
//       // setHistory(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderHistory = () => {
//     if (loading) {
//       return <ActivityIndicator size="large" color="#004d40" />;
//     }
//     if (history.length === 0) {
//       return (
//         <View style={styles.noHistoryContainer}>
//           <MaterialCommunityIcons name="history" size={100} color="#004d40" />
//           <Text style={styles.noHistoryText}>No History</Text>
//         </View>
//       );
//     }
//     return history.map((item, index) => (
//       <View key={index} style={styles.historyItem}>
//         <Text>{item.name}</Text>
//         <Text>{item.date}</Text>
//       </View>
//     ));
//   };

//   return (
//     <ImageBackground source={require('../../assets/byte.jpg')}
    
//       style={styles.backgroundImage}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.container}>
//           <View style={styles.formContainer}>
//             <View style={styles.switchContainer}>
//               <TouchableOpacity
//                 style={[styles.switchButton, selectedTab === 'Sent' && styles.switchButtonActive]}
//                 onPress={() => setSelectedTab('Sent')}
//               >
//                 <Text style={[styles.switchText, selectedTab === 'Sent' && styles.switchTextActive]}>Sent</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.switchButton, selectedTab === 'Received' && styles.switchButtonActive]}
//                 onPress={() => setSelectedTab('Received')}
//               >
//                 <Text style={[styles.switchText, selectedTab === 'Received' && styles.switchTextActive]}>Received</Text>
//               </TouchableOpacity>
//             </View>
//             {renderHistory()}
//           </View>
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//     padding: 20,
//   },
//   formContainer: {
//     width: 330,
//     height: 550,
//     marginTop: 40,
//     padding: 30,
//      borderRadius: 25,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     marginBottom: 40,
    
//   },
//   switchButton: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderTopLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     borderTopEndRadius: 25,
//     borderTopStartadius: 25,
//     borderBottomStartRadius:25
//   },
//   switchButtonActive: {
//     backgroundColor: '#004d40',
//   },
//   switchText: {
//     color: '#004d40',
//     fontSize: 18,
//   },
//   switchTextActive: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   noHistoryContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   noHistoryText: {
//     marginTop: 20,
//     fontSize: 18,
//     color: '#004d40',
//   },
//   historyItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
// });

// export default HistoryScreen;



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
// import { BACKEND_URL } from '../../env';

const HistoryScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Sent');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [selectedTab]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Simulate fetching data from an API
      const dummyData = generateDummyData(selectedTab);
      setHistory(dummyData);
      // Uncomment and use the following lines when connecting to a real backend
      // const endpoint = selectedTab === 'Sent' ? `${BACKEND_URL}/history/sent` : `${BACKEND_URL}/history/received`;
      // const response = await axios.get(endpoint);
      // setHistory(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateDummyData = (type) => {
    const data = [
      { id: 1, name: 'Audio 1', date: '2024-07-20', type: 'audio' },
      {id:7,name:'Video4', date:'2024-07-20',type:'video'},
      { id: 2, name: 'Video 1', date: '2024-07-19', type: 'video' },
      { id: 3, name: 'Document 1', date: '2024-07-19', type: 'document' },
      { id: 4, name: 'Audio 2', date: '2024-07-18', type: 'audio' },
      { id: 5, name: 'Video 2', date: '2024-07-18', type: 'video' },
      { id: 6, name: 'Document 2', date: '2024-07-17', type: 'document' },
    ];
    return data.filter(item => item.type === (type === 'Sent' ? 'document' : 'audio'));
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text>{item.name}</Text>
    </View>
  );

  const renderHistory = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#004d40" />;
    }
    if (history.length === 0) {
      return (
        <View style={styles.noHistoryContainer}>
          <MaterialCommunityIcons name="history" size={100} color="#004d40" />
          <Text style={styles.noHistoryText}>No History</Text>
        </View>
      );
    }
    const groupedHistory = groupByDate(history);
    const groupedData = Object.keys(groupedHistory).map(date => ({
      date,
      data: groupedHistory[date],
    }));
    return (
      <FlatList
        data={groupedData}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.dateHeader}>{item.date}</Text>
            <FlatList
              data={item.data}
              renderItem={renderHistoryItem}
              keyExtractor={(historyItem) => historyItem.id.toString()}
            />
          </View>
        )}
        keyExtractor={(item) => item.date}
      />
    );
  };

  const groupByDate = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});
  };

  return (
    <ImageBackground source={require('../../assets/byte.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[styles.switchButton, selectedTab === 'Sent' && styles.switchButtonActive]}
              onPress={() => setSelectedTab('Sent')}
            >
              <Text style={[styles.switchText, selectedTab === 'Sent' && styles.switchTextActive]}>Sent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchButton, selectedTab === 'Received' && styles.switchButtonActive]}
              onPress={() => setSelectedTab('Received')}
            >
              <Text style={[styles.switchText, selectedTab === 'Received' && styles.switchTextActive]}>Received</Text>
            </TouchableOpacity>
          </View>
          {renderHistory()}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  formContainer: {
    width: 330,
    height: 550,
    marginTop: 40,
    padding: 30,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
  },
  switchButtonActive: {
    backgroundColor: '#004d40',
  },
  switchText: {
    color: '#004d40',
    fontSize: 18,
  },
  switchTextActive: {
    color: '#fff',
    fontSize: 18,
  },
  noHistoryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noHistoryText: {
    marginTop: 20,
    fontSize: 18,
    color: '#004d40',
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#004d40',
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default HistoryScreen;
