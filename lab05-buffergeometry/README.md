# Lab 5: Forme nga BufferGeometry

Ndërtova një kristal gjashtëkëndor tërësisht nga BufferGeometry, pa gjeometri të gatshme.

Kristali ka **14 kulme** (2 maja dhe 2 unaza me nga 6 kulme) dhe **24 faqe trekëndëshe**
(6 sipër, 12 anash dhe 6 poshtë). E ndërtova **të indeksuar**: çdo kulm përdoret nga
disa faqe, ndaj koordinatat nuk përsëriten. Normalet i llogarita me `computeVertexNormals()`.

Kur ndërrova dy indekse të një faqeje (renditja e gabuar), ajo faqe u bë e padukshme nga
jashtë, sepse me `FrontSide` vizatohen vetëm faqet që "shikojnë" kah kamera. Faqja
dukej vetëm nga brenda kristalit.
