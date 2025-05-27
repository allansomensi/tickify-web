"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Table,
  Text,
  AlertDialog,
  IconButton,
  TextField,
  Callout,
  Skeleton,
  Badge,
} from "@radix-ui/themes";
import {
  PersonIcon,
  FileTextIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircledIcon,
  Pencil2Icon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { User } from "@/types/user";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("users");
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isCountLoading, setIsCountLoading] = useState(true);
  const [countError, setCountError] = useState("");

  useEffect(() => {
    if (activeTab === "users") {
      startTransition(async () => {
        try {
          const res = await fetch("/api/users", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (res.status === 401) {
            router.push("/login");
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to fetch users");
          }

          const data = await res.json();
          setUsers(data);
          setFilteredUsers(data);
        } catch {
          setError("Failed to load users. Please try again.");
        }
      });
    }
  }, [router, activeTab]);

  useEffect(() => {
    if (activeTab === "users") {
      setIsCountLoading(true);
      startTransition(async () => {
        try {
          const res = await fetch("/api/users/count", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (res.status === 401) {
            router.push("/login");
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to fetch user count");
          }

          const data = await res.json();
          setUserCount(data);
        } catch {
          setCountError("Failed to load user count. Please try again.");
        } finally {
          setIsCountLoading(false);
        }
      });
    }
  }, [router, activeTab]);

  useEffect(() => {
    if (activeTab === "users") {
      const filtered = users.filter((user) =>
        [user.username, user.email].some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users, activeTab]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleDeleteUser = (id: string) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.status !== 204) {
          const errorText = await res.text();
          throw new Error(`Failed to delete user: ${errorText}`);
        }

        setUsers((prev) => prev.filter((user) => user.id !== id));
        setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
        setUserCount((prev) => (prev !== null ? prev - 1 : prev));
        setSuccessMessage("User deleted successfully");
      } catch (err) {
        setError("Failed to delete user. Please try again.");
        console.error(err);
      }
    });
  };

  const handleEditUser = (id: string) => {
    router.push(`/users/edit/${id}`);
  };

  const handleCreateUser = () => {
    router.push("/users/create");
  };

  return (
    <Flex className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <Box
        className="w-64 border-r border-gray-700 bg-gray-800 p-6"
        style={{ minHeight: "100vh" }}
      >
        <Heading size="6" mb="8">
          Tickify Admin
        </Heading>
        <Flex direction="column" gap="3">
          <Button
            variant={activeTab === "users" ? "solid" : "ghost"}
            onClick={() => {
              setActiveTab("users");
              setSearchQuery("");
            }}
          >
            <PersonIcon className="mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === "tickets" ? "solid" : "ghost"}
            onClick={() => {
              setActiveTab("tickets");
              setSearchQuery("");
            }}
          >
            <FileTextIcon className="mr-2" />
            Tickets
          </Button>
        </Flex>
      </Box>

      {/* Main Content */}
      <Flex direction="column" p="6" flexGrow={"1"}>
        {/* Header */}
        <Card mb={"4"}>
          <Flex justify="between" align="center" p="2">
            <Heading size="8">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Heading>
            <Flex direction="column" gap="3">
              {(activeTab === "users" || activeTab === "tickets") && (
                <TextField.Root
                  placeholder={
                    activeTab === "users"
                      ? "Search users..."
                      : "Search tickets..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                >
                  <TextField.Slot>
                    <MagnifyingGlassIcon />
                  </TextField.Slot>
                </TextField.Root>
              )}
            </Flex>
          </Flex>
        </Card>

        {/* Notifications */}
        {successMessage && (
          <Callout.Root color="green" mb="4">
            <Callout.Icon>
              <CheckCircledIcon />
            </Callout.Icon>
            <Callout.Text>{successMessage}</Callout.Text>
          </Callout.Root>
        )}
        {error && (
          <Callout.Root color="red" mb="4">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        {countError && (
          <Callout.Root color="red" mb="4">
            <Callout.Text>{countError}</Callout.Text>
          </Callout.Root>
        )}

        {/* Content Area */}
        <Card size="4">
          {activeTab === "users" && (
            <>
              <Flex justify="between" align="center" mb="4">
                <Box>
                  <Heading size="6">Users</Heading>
                  {isCountLoading ? (
                    <Skeleton>
                      <Text size="4">Total Users: 100</Text>
                    </Skeleton>
                  ) : (
                    <Text size="4">Total Users: {userCount ?? "N/A"}</Text>
                  )}
                </Box>
                <Button onClick={handleCreateUser}>Create User</Button>
              </Flex>

              {isPending ? (
                <Flex justify="center" align="center" className="h-64">
                  <Text size="4">Loading users...</Text>
                </Flex>
              ) : filteredUsers.length === 0 ? (
                <Flex justify="center" align="center" className="h-64">
                  <Text size="4">
                    {searchQuery
                      ? "No users match your search."
                      : "No users found."}
                  </Text>
                </Flex>
              ) : (
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {filteredUsers.map((user) => (
                      <Table.Row key={user.id}>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                          <Badge
                            color={
                              user.role === "admin"
                                ? "red"
                                : user.role === "moderator"
                                  ? "jade"
                                  : "gray"
                            }
                          >
                            {user.role}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            color={
                              user.status === "active"
                                ? "jade"
                                : user.status === "inactive"
                                  ? "red"
                                  : "gray"
                            }
                          >
                            {user.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex gap="2">
                            <IconButton
                              variant="soft"
                              onClick={() => router.push(`/users/${user.id}`)}
                            >
                              <EyeOpenIcon />
                            </IconButton>
                            <IconButton
                              variant="soft"
                              onClick={() => handleEditUser(user.id)}
                            >
                              <Pencil2Icon />
                            </IconButton>
                            <AlertDialog.Root>
                              <AlertDialog.Trigger>
                                <IconButton color="red" variant="soft">
                                  <TrashIcon />
                                </IconButton>
                              </AlertDialog.Trigger>
                              <AlertDialog.Content maxWidth="450px">
                                <AlertDialog.Title>
                                  Delete user
                                </AlertDialog.Title>
                                <AlertDialog.Description size="2">
                                  Are you sure you want to delete this user?
                                  This action is irreversible and will
                                  immediately end all active sessions.
                                </AlertDialog.Description>

                                <Flex gap="3" mt="4" justify="end">
                                  <AlertDialog.Cancel>
                                    <Button variant="soft" color="gray">
                                      Cancel
                                    </Button>
                                  </AlertDialog.Cancel>
                                  <AlertDialog.Action>
                                    <Button
                                      variant="solid"
                                      color="red"
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      Delete
                                    </Button>
                                  </AlertDialog.Action>
                                </Flex>
                              </AlertDialog.Content>
                            </AlertDialog.Root>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </>
          )}

          {activeTab === "tickets" && (
            <Flex justify="center" align="center" className="h-64">
              <Text size="4">Tickets management coming soon...</Text>
            </Flex>
          )}
        </Card>
      </Flex>
    </Flex>
  );
}
