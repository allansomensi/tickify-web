"use client";

import { Ticket } from "@/types/ticket";
import { Card, Flex, Heading, Text, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/tickets", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await res.json();
        setTickets(data);
      } catch {
        setError("Failed to load tickets. Please try again.");
      }
    });
  }, [router]);

  return (
    <Flex
      direction="column"
      className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 p-6"
    >
      <Heading size="8" mb="6">
        Tickets
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
            <Text size="4">Loading tickets...</Text>
          </Flex>
        ) : tickets.length === 0 ? (
          <Flex justify="center" align="center" className="h-64">
            <Text size="4">No tickets found.</Text>
          </Flex>
        ) : (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Requester</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {tickets.map((ticket) => (
                <Table.Row key={ticket.id}>
                  <Table.Cell>{ticket.title}</Table.Cell>
                  <Table.Cell>{ticket.description}</Table.Cell>
                  <Table.Cell>{ticket.requester.username}</Table.Cell>
                  <Table.Cell>{ticket.status}</Table.Cell>
                  <Table.Cell>
                    {new Date(ticket.created_at).toLocaleDateString()}
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
