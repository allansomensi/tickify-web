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
import { Ticket } from "@/types/ticket";

interface Props {
  params: Promise<{ id: string }>;
}

export default function TicketDetailsPage({ params }: Props) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch ticket");
        }

        const data = await res.json();
        setTicket(data);
      } catch {
        setError("Failed to load ticket. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [id, router]);

  return (
    <Flex className="min-h-screen bg-gray-900" p="6">
      <Box flexGrow="1">
        {/* Header */}
        <Card mb="4">
          <Flex justify="between" align="center" p="2">
            <Heading size="8">Ticket Details</Heading>
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
                <DataList.Label>Title</DataList.Label>
                <DataList.Value>
                  <Skeleton>Ticket Title</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Description</DataList.Label>
                <DataList.Value>
                  <Skeleton>Ticket description goes here</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Status</DataList.Label>
                <DataList.Value>
                  <Skeleton>Open</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Requester</DataList.Label>
                <DataList.Value>
                  <Skeleton>user123</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Created At</DataList.Label>
                <DataList.Value>
                  <Skeleton>5/27/2025</Skeleton>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          ) : !ticket ? (
            <Flex justify="center" align="center" className="h-64">
              <Text size="4">Ticket not found.</Text>
            </Flex>
          ) : (
            <DataList.Root>
              <DataList.Item align="center">
                <DataList.Label>ID</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Code variant="ghost">{ticket.id || ""}</Code>
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
                <DataList.Label>Title</DataList.Label>
                <DataList.Value>{ticket.title || ""}</DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Description</DataList.Label>
                <DataList.Value>{ticket.description || ""}</DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Status</DataList.Label>
                <DataList.Value>
                  <Badge
                    color={
                      ticket.status === "open"
                        ? "jade"
                        : ticket.status === "closed"
                          ? "red"
                          : ticket.status === "pending"
                            ? "yellow"
                            : "gray"
                    }
                  >
                    {ticket.status || ""}
                  </Badge>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Requester</DataList.Label>
                <DataList.Value>
                  {ticket.requester?.username || ""}
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Created At</DataList.Label>
                <DataList.Value>
                  {ticket.created_at
                    ? new Date(ticket.created_at).toLocaleDateString()
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
