# Secció d'Ús d'IA Generativa

**Eina i Model utilitzat**: Gemini 3.6 Flash via su WEB

---

### Prompts

#### Prompt 1:
* **Prompt literal**:
  > *"Entiendo vale pero entonces el select solo puedo si los datos son de este schema, si tiene por ejemplo organizacion que hace referencia a otro es decir un join no podria con el select tendria que hacer el populate o como"*
* **Resposta de la IA**:
  Confirmació que `.select()` només funciona sobre propietats del mateix Schema. Per resoldre la relació d'una altra col·lecció cal utilitzar `.populate('campo', 'campos_a_seleccionar')`, combinant-ho opcionalment amb `.lean()` per optimitzar el retorn com a JSON pla.
* **Incoherències detectades**: 
  Cap incoherència tècnica.
* **Solució / Adaptació manual**: 
  Es va integrar la sintaxi directa `.populate('organization')` a les funcions del servei per gestionar les relacions de la tasca].

---

#### Prompt 2:
* **Prompt literal**:
  > *"¿Por qué en algunas funciones se usa `HydratedDocument<Task>` y en otras simplemente el tipo plano `Task`? ¿Cuándo es necesario usar `HydratedDocument` en TypeScript y Mongoose?"*
* **Resposta de la IA**:
  Explicació de la diferència entre un document "viu" de Mongoose i un objecte JSON pla. S'ha detallat que **`HydratedDocument<T>`** s'utilitza quan Mongoose retorna un document complet que conserva els mètodes interns de la instància (com `.save()` o `.populate()`). Quan la consulta utilitza **`.lean()`**, el tipatge de retorn ha de ser l'objecte JSON pla (`Task` o `Task[]`).
* **Incoherències detectades**: 
  S'acostuma a tipar per defecte totes les promeses amb el document complet de Mongoose, el que genera errors de compilació en TypeScript quan les funcions de cerca utilitzen `.lean()` per optimitzar el rendiment.
* **Solució / Adaptació manual**: 
  S'han reservat els retorns amb `Promise<HydratedDocument<Task>>` exclusivament per a les funcions que retornen la instància viva de Mongoose (com `createTask`, `getTaskById` o `updateTask`), i s'ha utilitzat el tipus pla `Task[]` per a les consultes de lectura que fan servir `.lean()` (com `listAllTasks`)].

---

#### Prompt 3:

* **Prompt literal**:
  > *"¿Por qué necesito poner `as any` en `organizations[0]._id as any`? ¿Cómo funciona TypeScript en este caso y por qué me da error si lo quito?"*

* **Resposta de la IA**:
  Explicació sobre com funciona la comprovació estricta de tipus en Mongoose i TypeScript. Mongoose tipa el camp `organization` d'un Schema com a `Types.ObjectId` (quan només es guarda la referència) o com l'interfície completa del document poblat (`IOrganization`) quan s'aplica `.populate()`. Si el tipus `Task` exigeix l'objecte poblat, TypeScript detecta una discrepància de signatures al passar-li directament una ID i genera un error de compilació. L'ús de `as any` permet desactivar aquesta validació en l'script de proves.

* **Incoherències detectades**: 
  Cap incoherència tècnica. La IA va explicar correctament que `as any` desactiva temporalment el comprovador de TypeScript per a un cas d'ús concret.

* **Solució / Adaptació manual**: 
  S'ha mantingut l'ús de `organizations[0]._id as any` dins de l'script principal (`main.ts`).

---

#### Prompt 4:
* **Prompt literal**:
  > *"const updated = await updateTask(created._id.toString(), { completed: true}); ¿cómo hago para actualizar solo el campo `completed`? Es que cuando le paso completed: true a la función me da error de TypeScript diciendo que me faltan todas las propiedades obligatorias del Schema de Task."*
* **Resposta de la IA**:
  Explicació de l'error `ts(2345)` en requerir l'objecte complet `NewTask` (creat amb `Pick`). Recomanació de canviar la signatura de la funció d'actualització per rebre **`Partial<Task>`** (o `Partial<NewTask>`).
* **Incoherències detectades**: 
  S'havia utilitzat inicialment el mateix tipus estricte tant per a la creació (`POST`) com per a l'actualització (`PUT/PATCH`), sense permetre modificacions de camps individuals.
* **Solució / Adaptació manual**: 
  S'ha aplicat el tipus `data: Partial<Task>` a la funció `updateTask` del servei. D'aquesta manera, a l'script `main.ts` es pot executar `updateTask(id, { completed: true })` de forma neta sense haver de tornar a passar propietats obligatòries com el títol o l'organització.

---
