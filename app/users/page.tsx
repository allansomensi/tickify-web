"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Card, Flex, Heading, Text, Table } from "@radix-ui/themes";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
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
      } catch {
        setError("Failed to load users. Please try again.");
      }
    });
  }, [router]);

  return (
    <Flex
      direction="column"
      className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 p-6"
    >
      <Heading size="8" mb="6">
        Users
      </Heading>

      <Card size="4">
        {error && (
          <Flex justify="center" mb="4">
            <Text color="red" size="2">
              {error}
            </Text>
          </Flex>
        )}

        {isPending ? (
          <Flex justify="center" align="center" className="h-64">
            <Text size="4">Loading users...</Text>
          </Flex>
        ) : users.length === 0 ? (
          <Flex justify="center" align="center" className="h-64">
            <Text size="4">No users found.</Text>
          </Flex>
        ) : (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Card>
    </Flex>
  );
}
