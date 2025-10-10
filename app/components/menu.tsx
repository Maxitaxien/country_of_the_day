import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button, TextInput, Group } from "@mantine/core";
import "@mantine/core/styles.css";
import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router";

interface CountryMenuProps {
  countries: string[];
  selected: string;
}

export function CountryMenu({ countries, selected }: CountryMenuProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = countries.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Drawer
        position="top"
        opened={opened}
        onClose={close}
        title="Available Countries"
      >
        <div className="flex flex-col gap-2">
          <TextInput
            placeholder="Search countries..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            mb="md"
          />
          {filtered.length > 0 ? (
            filtered.map((country) => (
              <Button
                key={country}
                variant={country === selected ? "filled" : "light"}
                fullWidth
                onClick={() => {
                  close();
                  navigate(`/?country=${country}`);
                }}
              >
                {country}
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