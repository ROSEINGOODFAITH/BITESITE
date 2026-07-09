import type {FaqItem} from '~/lib/faq';
import {Accordion} from '~/components/Accordion';

/**
 * FAQ accordion group with FAQPage JSON-LD (BLUEPRINT §C18).
 * Set `withSchema` on exactly one instance per page.
 */
export function FAQAccordion({
  items,
  withSchema = false,
}: {
  items: FaqItem[];
  withSchema?: boolean;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {'@type': 'Answer', text: item.answer},
    })),
  };

  return (
    <div>
      {withSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
        />
      ) : null}
      {items.map((item) => (
        <Accordion key={item.id} title={item.question}>
          <p>{item.answer}</p>
        </Accordion>
      ))}
    </div>
  );
}
