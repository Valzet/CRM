import { useNavigate } from "react-router-dom";
import {
  MobileCard,
  MobileCardDate,
  MobileCardGrid,
  MobileCardLink,
  MobileCardList,
  MobileCardMeta,
  MobileCardNote,
  MobileCardTitle,
  MobileCardTop,
  MobileEmpty,
} from "../list-page/mobile-list.styled";
import { path } from "../../lib/constants/navigation";
import { formatDateRu } from "../../lib/format/date-ru";
import { formatPhoneRu } from "../../lib/format/phone-ru";
import type { Client } from "../../types";

function displayWebsite(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

type Props = {
  clients: Client[];
};

export function ClientsMobileList({ clients }: Props) {
  const navigate = useNavigate();

  if (!clients.length) {
    return <MobileEmpty>Клиенты не найдены</MobileEmpty>;
  }

  return (
    <MobileCardList>
      {clients.map((client) => (
        <MobileCard
          key={client.id}
          $deleted={client.deleted}
          onClick={() => navigate(`${path.clients}/${client.id}/edit`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`${path.clients}/${client.id}/edit`);
            }
          }}
        >
          <MobileCardTop>
            <MobileCardTitle>{client.name}</MobileCardTitle>
            <MobileCardDate>{formatDateRu(client.createdAt)}</MobileCardDate>
          </MobileCardTop>
          <MobileCardGrid>
            <div>
              {client.phone ? (
                <MobileCardLink href={`tel:${client.phone}`} onClick={(e) => e.stopPropagation()}>
                  {formatPhoneRu(client.phone)}
                </MobileCardLink>
              ) : (
                <MobileCardMeta>—</MobileCardMeta>
              )}
              {client.email ? (
                <MobileCardMeta as="div" style={{ marginTop: 4 }}>
                  <MobileCardLink
                    href={`mailto:${client.email}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {client.email}
                  </MobileCardLink>
                </MobileCardMeta>
              ) : null}
            </div>
            <div>
              <MobileCardMeta>{client.company || "—"}</MobileCardMeta>
              {client.website ? (
                <MobileCardMeta as="div" style={{ marginTop: 4 }}>
                  <MobileCardLink
                    href={
                      client.website.startsWith("http")
                        ? client.website
                        : `https://${client.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {displayWebsite(client.website)}
                  </MobileCardLink>
                </MobileCardMeta>
              ) : null}
            </div>
          </MobileCardGrid>
          {client.comment ? <MobileCardNote>{client.comment}</MobileCardNote> : null}
        </MobileCard>
      ))}
    </MobileCardList>
  );
}
