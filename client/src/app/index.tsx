import ReminderListItem from "@/components/ReminderListItem";
import {
  createReminders,
  getReminders,
  updateReminders,
} from "@/services/reminderServices";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContainer: {
    width: "100%",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF8C00",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    color: "white",
    elevation: 2,
  },
  input: {
    padding: 12,
    width: "100%",
    borderColor: "#e0e0e0",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fafbfc",
    fontSize: 16,
    color: "#222",
    marginBottom: 8,
  },
  label: {
    marginBottom: 6,
    fontSize: 15,
    color: "#333",
    fontWeight: "700",
  },
  formContainer: {
    margin: 10,
    gap: 20,
    width: "100%",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: "#ff8c00",
    marginBottom: 18,
    alignSelf: "center",
  },
  noData: {
    textAlign: "center",
    flex: 1,
    opacity: 0.5,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 40,
  },
  newReminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    alignSelf: "center",
    backgroundColor: "#FF8C00",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    elevation: 2,
  },
  newReminderText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 17,
    marginLeft: 6,
  },
});

export default function HomeScreen() {
  type ModalMode = "create" | "update";
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [isCreateUpdateModal, setIsCreateUpdateModal] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    reminder: "",
    note: "",
    id: "",
  });
  const isLoadingApi = useGlobalLoading();

  const queryClient = useQueryClient();

  const validateFormData = (formData: any): true | string => {
    if (!formData.reminder) {
      return "Please fill the reminder field";
    }
    if (!formData.note) {
      return "Please fill the note field";
    }
    return true;
  };

  const { mutate: updateReminderFun, isPending: updatePending } = useMutation({
    mutationFn: () => updateReminders(formData.id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reminder"] });
      setIsCreateUpdateModal(false);
      setFormData({ reminder: "", note: "" });
    },
    onError: (error) => {},
  });
  const { mutate: createReminderFun, isPending } = useMutation({
    mutationFn: () => createReminders(formData.reminder, formData.note),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reminder"] });
      setIsCreateUpdateModal(false);
      setFormData({ reminder: "", note: "" });
    },
    onError: (error) => {},
  });

  const inputOnChange = (name: any, text: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: text }));
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["reminder"],
    queryFn: () => getReminders(),
  });

  if (isLoading) {
    return <ActivityIndicator size={"large"} style={{ marginTop: "20%" }} />;
  }

  if (error) {
    return (
      <Text
        style={{ marginTop: "20%", fontWeight: "bold", alignSelf: "center" }}
      >
        {error.message}
      </Text>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7fa" }}>
        <View
          style={{
            flex: 1,
            marginTop: 32,
            marginBottom: 32,
            marginHorizontal: 16,
            padding: 20,
            backgroundColor: "#fff",
            borderRadius: 18,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <LoadingOverlay visible={isLoadingApi} />
          <Modal
            animationType="slide"
            transparent={true}
            visible={isCreateUpdateModal}
            onRequestClose={() => setIsCreateUpdateModal(false)}
          >
            {/* Outer touch handler to close modal when tapping outside */}
            <TouchableWithoutFeedback
              onPress={() => setIsCreateUpdateModal(false)}
            >
              <View style={styles.modalOverlay}>
                {/* Inner touch handler to prevent propagation */}
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#FF8C00",
                          fontWeight: "bold",
                        }}
                      >
                        Reminder Form
                      </Text>
                      <View style={styles.formContainer}>
                        <View>
                          <Text style={styles.label}>Reminder</Text>
                          <TextInput
                            multiline
                            editable={!isPending}
                            selectTextOnFocus={!isPending}
                            style={styles.input}
                            onChangeText={(input) =>
                              inputOnChange("reminder", input)
                            }
                            value={formData.reminder}
                            placeholder="Reminder"
                          />
                        </View>
                        <View>
                          <Text style={styles.label}>Note</Text>
                          <TextInput
                            editable={!isPending}
                            selectTextOnFocus={!isPending}
                            multiline
                            style={styles.input}
                            onChangeText={(input) =>
                              inputOnChange("note", input)
                            }
                            value={formData.note}
                            placeholder="Note (optional)"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                        }}
                      >
                        <Pressable
                          style={styles.closeButton}
                          onPress={() => {
                            setFormData({ reminder: "", note: "" });
                            setIsCreateUpdateModal(false);
                          }}
                        >
                          <Text style={{ color: "white" }}>Close</Text>
                        </Pressable>
                        <TouchableOpacity
                          style={[
                            styles.closeButton,
                            isPending && { opacity: 0.6 }, // Optional visual cue for disabled button
                          ]}
                          onPress={() => {
                            if (modalMode === "create") {
                              createReminderFun();
                            } else if (modalMode === "update") {
                              updateReminderFun();
                            } else {
                              createReminderFun(); // Assuming 'delete' should also use createReminderFun?
                            }
                          }}
                          disabled={isPending || updatePending}
                        >
                          {isPending || updatePending ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text style={{ color: "white" }}>
                              {modalMode === "create"
                                ? "Submit"
                                : modalMode === "update"
                                  ? "Update"
                                  : "Delete"}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ReminderListItem
                setIsCreateUpdateModal={setIsCreateUpdateModal}
                reminderList={item}
                setFormData={setFormData}
                setModalMode={setModalMode}
              />
            )}
            ListHeaderComponent={
              <Text
                style={{
                  fontSize: 27,
                  fontWeight: "bold",
                  letterSpacing: 0.5,
                  color: "#ff8c00",
                  marginBottom: 15,
                  alignSelf: "center",
                }}
              >
                Reminders
              </Text>
            }
          />
          {data.length == 0 && (
            <Text
              style={{
                textAlign: "center",
                flex: 1,
                opacity: 0.5,
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              No Data
            </Text>
          )}
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 10,
              alignSelf: "center",
            }}
            onPress={() => {
              setModalMode("create");
              setIsCreateUpdateModal(true);
            }}
          >
            <Entypo name="circle-with-plus" size={24} color="#FF8C00" />
            <Text style={{ fontWeight: 600, color: "#FF8C00", fontSize: 16 }}>
              New Reminder
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
