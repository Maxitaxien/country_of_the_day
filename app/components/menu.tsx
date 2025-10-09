import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button, TextInput, Group } from "@mantine/core";
import "@mantine/core/styles.css";
import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";

export function CountryMenu() {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");

  // placeholder data - load in from supabase
  const items = Array.from({ length: 30 }, (_, i) => `Option ${i + 1}`);
  const filtered = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Drawer
        position="top"
        opened={opened}
        onClose={close}
        title="Available Countries"
      >
        <div className="flex flex-col gap-8px">
          <TextInput
            placeholder="Search countries..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            mb="md"
          />
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <Button key={item} variant="light" fullWidth onClick={close}>
                {item}
              </Button>
            ))
          ) : (
            <Group justify="center" pt="md">
              No results found
            </Group>
          )}
        </div>
      </Drawer>
      <Button variant="default" onClick={open}>
        Choose another country
      </Button>
    </>
  );
}
