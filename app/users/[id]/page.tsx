"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  Callout,
  DataList,
  Code,
  IconButton,
  Skeleton,
  Badge,
} from "@radix-ui/themes";
import { CopyIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { User } from "@/types/user";

interface Props {
  params: Promise<{ id: string }>;
}

export default function UserDetailsPage({ params }: Props) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch user");
        }

        const data = await res.json();
        setUser(data);
      } catch {
        setError("Failed to load user. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  return (
    <Flex className="min-h-screen bg-gray-900" p="6">
      <Box flexGrow="1">
        {/* Header */}
        <Card mb="4">
          <Flex justify="between" align="center" p="2">
            <Heading size="8">User Details</Heading>
            <Button variant="solid" onClick={() => router.push("/admin")}>
              Back to Admin
            </Button>
          </Flex>
        </Card>

        {/* Error Notification */}
        {error && (
          <Callout.Root color="red" className="mb-4">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        {/* Content Area */}
        <Card size="4">
          {isLoading ? (
            <DataList.Root>
              <DataList.Item align="center">
                <DataList.Label>ID</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Skeleton>
                      <Code variant="ghost">
                        3fa85f64-5717-4562-b3fc-2c963f66afa6
                      </Code>
                    </Skeleton>
                    <Skeleton>
                      <IconButton
                        size="1"
                        aria-label="Copy value"
                        color="gray"
                        variant="ghost"
                      >
                        <CopyIcon />
                      </IconButton>
                    </Skeleton>
                  </Flex>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Username</DataList.Label>
                <DataList.Value>
                  <Skeleton>loadinguser</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>
                  <Skeleton>user@example.com</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>First Name</DataList.Label>
                <DataList.Value>
                  <Skeleton>John</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Last Name</DataList.Label>
                <DataList.Value>
                  <Skeleton>Doe</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Role</DataList.Label>
                <DataList.Value>
                  <Skeleton>User</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Status</DataList.Label>
                <DataList.Value>
                  <Skeleton>Active</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Created At</DataList.Label>
                <DataList.Value>
                  <Skeleton>5/27/2025</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Updated At</DataList.Label>
                <DataList.Value>
                  <Skeleton>5/27/2025</Skeleton>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          ) : !user ? (
            <Flex justify="center" align="center" className="h-64">
              <Text size="4">User not found.</Text>
            </Flex>
          ) : (
            <DataList.Root>
              <DataList.Item align="center">
                <DataList.Label>ID</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Code variant="ghost">{user.id || ""}</Code>
                    <IconButton
                      size="1"
                      aria-label="Copy value"
                      color="gray"
                      variant="ghost"
                    >
                      <CopyIcon />
                    </IconButton>
                  </Flex>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Username</DataList.Label>
                <DataList.Value>{user.username || ""}</DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>{user.email || ""}</DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>First Name</DataList.Label>
                <DataList.Value>{user.first_name || ""}</DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Last Name</DataList.Label>
                <DataList.Value>{user.last_name || ""}</DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Role</DataList.Label>
                <DataList.Value>
                  <Badge
                    color={
                      user.role === "admin"
                        ? "red"
                        : user.role === "moderator"
                          ? "jade"
                          : "gray"
                    }
                  >
                    {user.role || ""}
                  </Badge>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Status</DataList.Label>
                <DataList.Value>
                  <Badge
                    color={
                      user.status === "active"
                        ? "jade"
                        : user.status === "inactive"
                          ? "red"
                          : "gray"
                    }
                  >
                    {user.status || ""}
                  </Badge>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Created At</DataList.Label>
                <DataList.Value>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : ""}
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Updated At</DataList.Label>
                <DataList.Value>
                  {user.updated_at
                    ? new Date(user.updated_at).toLocaleDateString()
                    : ""}
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          )}
        </Card>
      </Box>
    </Flex>
  );
}
