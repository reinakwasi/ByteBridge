
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator, SectionList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { groupBy } from 'lodash';

// const cloudItemsEndpoint = ''; 

const dummyData = [
  { name: 'File 1', date: '2023-07-21' },
  { name: 'File 2', date: '2023-07-21' },
  { name: 'File 3', date: '2023-07-22' },
  { name: 'Document', date: '2023-05-13' }
];

const CloudScreen = () => {
  const [cloudItems, setCloudItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCloudItems();
  }, []);

  const fetchCloudItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(cloudItemsEndpoint);
      if (response.status === 200) {
        setCloudItems(response.data);
      } else {
        setCloudItems(dummyData); 
      }
    } catch (error) {
      console.log(error);
      setCloudItems(dummyData); 
    } finally {
      setLoading(false);
    }
  };

  const groupItemsByDate = (items) => {
    const groupedItems = groupBy(items, 'date');
    return Object.keys(groupedItems).map((date) => ({
      title: date,
      data: groupedItems[date],
    }));
  };

  const renderCloudItem = ({ item }) => (
    <View style={styles.cloudItem}>
      <Text>{item.name}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.switchContainer}>
          <View style={styles.switchButtonActive}>
            <Text style={styles.switchTextActive}>Cloud</Text>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#004d40" />
        ) : cloudItems.length === 0 ? (
          <View style={styles.noItemsContainer}>
            <MaterialCommunityIcons name="cloud-off-outline" size={100} color="#004d40" />
            <Text style={styles.noItemsText}>No Items in Cloud</Text>
          </View>
        ) : (
          <SectionList
            sections={groupItemsByDate(cloudItems)}
            renderItem={renderCloudItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>

      <Modal visible={loading} transparent animationType="fade">
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size={60} color="#004d40" />
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    height: '100%',
    padding: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    marginTop:10,
    marginBottom: 40,
  },
  switchButtonActive: {
    flex: 1,
    paddingVertical: 10,
    
    alignItems: 'center',
    backgroundColor: '#004d40',
  },
  switchTextActive: {
    color: '#fff',
    fontSize: 18,
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: '#eee',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cloudItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noItemsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noItemsText: {
    marginTop: 20,
    fontSize: 18,
    color: '#004d40',
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CloudScreen;
