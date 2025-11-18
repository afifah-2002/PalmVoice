import React from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { PalmButton } from './PalmButton';

interface PalmTextInputProps {
  visible: boolean;
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const PalmTextInput: React.FC<PalmTextInputProps> = ({
  visible,
  title,
  value,
  onChangeText,
  onSave,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChangeText}
              autoFocus
              multiline
              maxLength={100}
            />
          </View>

          <View style={styles.footer}>
            <PalmButton title="CANCEL" onPress={onCancel} />
            <View style={styles.buttonSpacer} />
            <PalmButton title="SAVE" onPress={onSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  header: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  title: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    padding: 16,
  },
  input: {
    fontFamily: 'Courier',
    fontSize: 14,
    color: '#000000',
    borderWidth: 2,
    borderColor: '#000000',
    padding: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
  buttonSpacer: {
    width: 16,
  },
});
