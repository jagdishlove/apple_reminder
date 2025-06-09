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
    reminderList.completed
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
        gap: 5,
        marginBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "grey",
        paddingBottom: 10,
      }}
    >
      <TouchableOpacity onPress={() => completeTask(isCompleted)}>
        {isCompleted ? (
          <MaterialCommunityIcons
            name="circle-slice-8"
            size={22}
            color="#FF8C00"
            style={{ alignSelf: "flex-start" }}
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-circle-outline"
            size={22}
            color="grey"
            style={{ alignSelf: "flex-start" }}
          />
        )}
      </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <View
          style={{
            display: "flex",
            width: "80%",
            gap: 5,
          }}
        >
          <Text
            style={{
              textTransform: "capitalize",
            }}
          >
            {reminderList.reminder}
          </Text>
          {reminderList.note && (
            <Text
              style={{
                fontSize: 12,
                color: "grey",
              }}
            >
              {reminderList.note}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              name="infocirlceo"
              size={17}
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
    </View>
  );
};

export default ReminderListItem;
