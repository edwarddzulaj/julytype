"use client";

import { fetchAPI } from "@/app/utils/fetch-api";
import { useRef, useState } from "react";

export default function StudentEmailVerificationForm({
  setEmailValid,
}: {
  setEmailValid: Function;
}) {
  const [isStudentEmailInvalid, setIsStudentEmailInvalid] = useState(false);
  const studentEmail = useRef<HTMLInputElement>(null);
  const verificationCode = useRef<HTMLInputElement>(null);

  const sendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStudentEmailInvalid(false);
    const studentEmailInput = studentEmail.current?.value;

    if (studentEmail.current?.value) {
      const response = await fetchAPI(
        "/order/send_verification_code",
        {},
        {
          method: "POST",
          body: JSON.stringify({
            studentEmail: studentEmailInput,
          }),
        }
      );

      if (response.status === 406) {
        setIsStudentEmailInvalid(true);

        setTimeout(() => {
          setIsStudentEmailInvalid(false);
        }, 5000);
      }
    }
  };

  const verifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <form>
        <div>
          <input
            ref={studentEmail}
            type="email"
            name="email"
            id="email"
            placeholder="Student E-mail address*"
            required
          />
          <button type="submit" onClick={sendVerificationCode}>
            Send e-mail
          </button>
        </div>
        {isStudentEmailInvalid && (
          <p>Student email appears to be invalid. Try again with a different email.</p>
        )}
      </form>
      <form>
        <input
          ref={verificationCode}
          type="text"
          name="verification-code"
          id="verification-code"
          placeholder="Verification code*"
          required
        />
        <button type="submit" onClick={verifyEmail}>
          Submit
        </button>
      </form>
    </>
  );
}
