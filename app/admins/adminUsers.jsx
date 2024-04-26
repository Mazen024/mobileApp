import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, Pressable, Modal, TextInput } from 'react-native';
import { getDocs, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth, signOut } from 'firebase/auth';
import AddUser from './addUsers';
import { Ionicons } from '@expo/vector-icons';

export default function adminUsers() {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const updatedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(updatedUsers);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteUser = async (userEmail) => {
    try {
      if (userEmail === 'adelmazen47@gmail.com') {
        alert('Admin user cannot be deleted by this way');
        return;
      }
  
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userDoc = querySnapshot.docs.find(doc => doc.data().email === userEmail);
      
      if (userDoc) {
        await deleteDoc(userDoc.ref);
        console.log('User deleted successfully');
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  const handleDeleteAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersToDelete = querySnapshot.docs.filter(doc => doc.data().email !== 'adelmazen47@gmail.com');
      
      usersToDelete.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      alert('All users except admin deleted successfully');
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };
  

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
        <Pressable style={styles.addButton} onPress={() => setShowAddUserModal(true)}>
          <Text style={styles.buttonText}>Add User</Text>
        </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddUserModal}
        onRequestClose={() => setShowAddUserModal(false)}
      >
        <View style={styles.modalContainer}>
          <AddUser />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditUserModal}
        onRequestClose={() => setShowEditUserModal(false)}
      >
        <View style={styles.modalContainer}>
        </View>
      </Modal>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
            <View style={styles.buttonContainer}>
              <Pressable onPress={() => handleEditUser(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => handleDeleteUser(item.email)} style={styles.deleteButton}>
                <Ionicons name="trash-bin-outline" size={24} color="red" />
              </Pressable>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No users found</Text>}
      />
      <Pressable style={styles.addButton} onPress={() => handleDeleteAllUsers}>
          <Text style={styles.buttonText}>Delete All User</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 4,
    borderRadius: 5,
  },
});
