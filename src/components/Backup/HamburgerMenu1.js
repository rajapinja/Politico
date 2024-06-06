import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const HamburgerMenu = ({hamburgerStyle}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={styles.hamburgerMenu}>
      <TouchableOpacity onPress={() => setShowMenu(true)} style={hamburgerStyle}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setShowMenu(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <View style={styles.menuItems}>
            <Text style={styles.menuItem}>Menu Item 1</Text>
            <Text style={styles.menuItem}>Menu Item 2</Text>
            <Text style={styles.menuItem}>Menu Item 3</Text>
            {/* Add more menu items as needed */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: 'white',
    fontSize: 18,
  },
  menuItems: {
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    fontSize: 18,
  },
  hamburgerMenu: {
    position: 'absolute',
    top: 50, // Adjust based on the header's height
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    zIndex: 2,
    elevation: 4, // Android shadow
  },
});

export default HamburgerMenu;
