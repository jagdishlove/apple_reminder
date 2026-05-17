import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Reminder } from "@/types/reminderTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  completeReminders,
  deleteReminders,
} from "@/services/reminderServices";
import Feather from "@expo/vector-icons/Feather";

type reminderProps = {
  reminderList: Reminder;
  setIsCreateUpdateModal: any;
  setFormData: any;
  setModalMode: any;
};

const ReminderListItem = ({
  reminderList,
  setIsCreateUpdateModal,
  setFormData,
  setModalMode,
}: reminderProps) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(
    reminderList.completed,
  );
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteReminders,
    onSuccess: () => {
      // Invalidate and refetch the todos query
      queryClient.invalidateQueries({ queryKey: ["reminder"] });
    },
    onError: (error) => {
      console.error("Error deleting todo:", error);
    },
  });
  const { mutate: completeTask } = useMutation({
    mutationFn: (isReminderCompleted: boolean) =>
      completeReminders(reminderList.id, isReminderCompleted),
    onSuccess: (data) => setIsCompleted(data.completed),
    onError: (error) => {},
  });
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        paddingBottom: 12,
        backgroundColor: isCompleted ? "#f8f8f8" : "#fff",
        borderRadius: 10,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <TouchableOpacity onPress={() => completeTask(!isCompleted)}>
        {isCompleted ? (
          <MaterialCommunityIcons
            name="check-circle"
            size={26}
            color="#FF8C00"
            style={{ alignSelf: "flex-start" }}
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-circle-outline"
            size={26}
            color="#bbb"
            style={{ alignSelf: "flex-start" }}
          />
        )}
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text
          style={{
            textTransform: "capitalize",
            fontWeight: "600",
            fontSize: 16,
            color: isCompleted ? "#aaa" : "#222",
            textDecorationLine: isCompleted ? "line-through" : "none",
          }}
        >
          {reminderList.reminder}
        </Text>
        {reminderList.note && (
          <Text
            style={{
              fontSize: 13,
              color: "#888",
              marginTop: 2,
            }}
          >
            {reminderList.note}
          </Text>
        )}
      </View>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Pressable
          onPress={() => {
            setFormData({
              reminder: reminderList.reminder,
              note: reminderList.note,
              id: reminderList.id,
            });
            setIsCreateUpdateModal(true);
            setModalMode("update");
          }}
        >
          <AntDesign
            name="edit"
            size={20}
            color="#FF8C00"
            style={{ alignSelf: "flex-start" }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            deleteMutation.mutate(reminderList.id);
          }}
        >
          <Feather name="delete" size={20} color="#FF8C00" />
        </Pressable>
      </View>
    </View>
  );
};

export default ReminderListItem;
