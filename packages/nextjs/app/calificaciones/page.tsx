"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Attestation } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { zeroAddress } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { useBalance } from "wagmi";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { AddressInput } from "~~/components/scaffold-eth";
import appConfig from "~~/config";
import { useEAS } from "~~/hooks/useEAS";
import { notification } from "~~/utils/scaffold-eth";

interface GradeReportData {
  nombre: string;
  cuenta: string;
  year: number;
  periodo: string;
  espanol: number;
  matematicas: number;
  ingles: number;
  historia: number;
  ciencias: number;
  geografia: number;
}

const RatingForm: NextPage = () => {
  const [studentAddress, setStudentAddress] = useState("");
  const [newAttestation, setNewAttestation] = useState<Attestation | null>(null);
  const [form, setForm] = useState<GradeReportData>({
    nombre: "",
    cuenta: "",
    year: new Date().getFullYear(),
    periodo: new Date().toLocaleString("es-ES", { month: "long" }),
    espanol: 0,
    matematicas: 0,
    ingles: 0,
    historia: 0,
    ciencias: 0,
    geografia: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // const router = useRouter();
  const network = useNetwork();
  console.log(network);
  const { eas } = useEAS();
  const { address: connectedAddress } = useAccount();
  const {
    data: userBalance,
    isError: isErrorUserBalance,
    isLoading: isLoadingUserBalance,
  } = useBalance({
    address: connectedAddress,
  });
  const session = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevData => ({
      ...prevData,
      [name]:
        name === "espanol" || name === "matematicas" || name === "ingles" || name === "historia" || name === "ciencias"
          ? parseInt(value)
          : value,
    }));
  };

  async function createAttestation(attestationId: string, txId: string) {
    console.log("Saving attestation...");

    const createAttestationRes = await fetch("/api/attestations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attestationId,
        txId,
        chain: "SCROLL_SEPOLIA",
        schemaId: appConfig.attestations.scrollSepolia.gradesReport.id,
        attester: connectedAddress,
        recipient: studentAddress,
        studentId: studentAddress,
        studentAlias: form.nombre,
        year: form.year,
        period: form.periodo,
        subjectName1: "Español",
        subjectScore1: form.espanol.toString(),
        subjectName2: "Matemáticas",
        subjectScore2: form.matematicas.toString(),
        subjectName3: "Inglés",
        subjectScore3: form.ingles.toString(),
        subjectName4: "Historia",
        subjectScore4: form.historia.toString(),
        subjectName5: "Ciencias",
        subjectScore5: form.ciencias.toString(),
        subjectName6: "Geografia",
        subjectScore6: form.geografia.toString(),
        connectedAddress,
      }),
    });
    const attestationResData = await createAttestationRes.json();
    return attestationResData.attestation;
  }

  async function createGradesReport(event: FormEvent) {
    event?.preventDefault();
    setIsLoading(true);
    console.log("Datos enviados:", form);
    if (!eas) return;
    if (!session || !session.data?.user?.name || session.data?.user?.name !== connectedAddress) {
      setIsLoading(false);
      return notification.warning("Debes iniciar sesión");
    }
    if (
      !form.nombre ||
      !studentAddress ||
      !form.espanol ||
      !form.matematicas ||
      !form.ingles ||
      !form.historia ||
      !form.ciencias ||
      !form.geografia
    ) {
      setIsLoading(false);
      console.log(form);
      return notification.warning("Debes responder ambas preguntas");
    }
    if (isErrorUserBalance || isLoadingUserBalance || parseFloat(userBalance?.formatted ?? "0") < 0.0005) {
      setIsLoading(false);
      return notification.warning("Asegúrate de conectar tu cartera y contar con suficiente ETH en Scroll Testnet");
    }
    try {
      const schemaEncoder = new SchemaEncoder(appConfig.attestations.scrollSepolia.gradesReport.schema);
      const encodedData = schemaEncoder.encodeData([
        { name: "studentId", value: zeroAddress, type: "string" },
        { name: "studentAlias", value: "Student1", type: "string" },
        { name: "year", value: form.year, type: "uint16" },
        { name: "period", value: form.periodo, type: "string" },
        { name: "subjectName1", value: "Español", type: "string" },
        { name: "subjectScore1", value: form.espanol.toString(), type: "string" },
        { name: "subjectName2", value: "Matemáticas", type: "string" },
        { name: "subjectScore2", value: form.matematicas.toString(), type: "string" },
        { name: "subjectName3", value: "Inglés", type: "string" },
        { name: "subjectScore3", value: form.ingles.toString(), type: "string" },
        { name: "subjectName4", value: "Historia", type: "string" },
        { name: "subjectScore4", value: form.historia.toString(), type: "string" },
        { name: "subjectName5", value: "Ciencias", type: "string" },
        { name: "subjectScore5", value: form.ciencias.toString(), type: "string" },
        { name: "subjectName6", value: "Geografia", type: "string" },
        { name: "subjectScore6", value: form.geografia.toString(), type: "string" },
      ]);

      const transaction = await eas.attest({
        schema: appConfig.attestations.scrollSepolia.gradesReport.id,
        data: {
          recipient: studentAddress,
          expirationTime: undefined,
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await transaction.wait();
      const createdAttestation = await createAttestation(newAttestationUID, transaction.tx.hash);
      console.log(createdAttestation);
      setNewAttestation(createdAttestation);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Formulario de Calificaciones</h2>
      <form onSubmit={createGradesReport} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="cuenta" className="block">
            Cuenta:
          </label>
          <AddressInput
            onChange={setStudentAddress}
            value={studentAddress}
            name="collaborator"
            placeholder="Dirección o ENS"
          />
        </div>
        <div>
          <label htmlFor="periodo" className="block">
            Periodo:
          </label>
          <input
            type="text"
            id="periodo"
            name="periodo"
            value={form.periodo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="espanol" className="block">
              Español:
            </label>
            <input
              type="number"
              id="espanol"
              name="espanol"
              value={form.espanol}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="matematicas" className="block">
              Matemáticas:
            </label>
            <input
              type="number"
              id="matematicas"
              name="matematicas"
              value={form.matematicas}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="ingles" className="block">
              Inglés:
            </label>
            <input
              type="number"
              id="ingles"
              name="ingles"
              value={form.ingles}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="historia" className="block">
              Historia:
            </label>
            <input
              type="number"
              id="historia"
              name="historia"
              value={form.historia}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="ciencias" className="block">
              Ciencias:
            </label>
            <input
              type="number"
              id="ciencias"
              name="ciencias"
              value={form.ciencias}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="ciencias" className="block">
              Geografía:
            </label>
            <input
              type="number"
              id="geografia"
              name="geografia"
              value={form.geografia}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </form>
      {newAttestation && (
        <div className="w-full flex flex-col items-center pt-2 space-y-2">
          <Link
            href={appConfig.explorers.scrollSepolia.attestation + `/${newAttestation.id}`}
            target="blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 dark:text-accent font-bold"
          >
            <span>Atestación</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4 mb-1" />
          </Link>
          <Link
            href={appConfig.explorers.scrollSepolia.blockchain + `/tx/${newAttestation.txId}`}
            target="blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-700 dark:text-accent font-bold"
          >
            <span>Transacción</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4 mb-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RatingForm;
