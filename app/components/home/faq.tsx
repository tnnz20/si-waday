import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { FAQ_ITEMS } from '@/constants/faq';

export function Faq() {
  return (
    <section id="faq" className="bg-background py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-accent-500 mb-2 block text-xs font-bold tracking-widest uppercase">
            PERTANYAAN UMUM
          </span>
          <h2 className="text-darknavy-900 text-3xl font-extrabold">Hal yang Sering Ditanyakan</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-warm-200 overflow-hidden rounded-3xl border bg-white px-6 shadow-sm"
            >
              <AccordionTrigger className="text-darknavy-900 hover:text-accent-500 py-6 text-left text-sm font-bold transition-colors hover:no-underline">
                <span>{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="border-warm-100 border-t pt-4 pb-6 text-xs leading-relaxed text-slate-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
