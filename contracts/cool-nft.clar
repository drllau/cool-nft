(define-non-fungible-token cool-nft uint)

;; Public functions
(define-constant nft-not-owned-err (err u401)) ;; unauthorized
(define-constant nft-not-found-err (err u404)) ;; not found
(define-constant sender-equals-recipient-err (err u405)) ;; method not allowed

(define-private (nft-transfer-err (code uint))
  (if (is-eq u1 code)
    nft-not-owned-err
    (if (is-eq u2 code)
      sender-equals-recipient-err
      (if (is-eq u3 code)
        nft-not-found-err
        (err code)))))

;; Transfers tokens to a specified principal.
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (if (and
        (is-eq sender (unwrap! (nft-get-owner? cool-nft token-id) nft-not-found-err))
        (is-eq tx-sender sender)
        (not (is-eq recipient sender))
				)
       (match (nft-transfer?  cool-nft token-id sender recipient)
        success (ok success)
        error (nft-transfer-err error))
      nft-not-owned-err))

;; Gets the owner of the specified token ID.
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner?  cool-nft token-id)))

;; Gets the owner of the specified token ID.
(define-read-only (get-last-token-id)
  (ok u1))

(define-read-only (get-errstr (code uint))
  (ok (if (is-eq u401 code)
    "nft-not-owned"
    (if (is-eq u404 code)
      "nft-not-found"
      (if (is-eq u405 code)
        "sender-equals-recipient"
        "unknown-error")))))

;; Initialize the contract
(try! (nft-mint? cool-nft  u1 tx-sender))


(define-public (claim (token-id uint))
	(begin
		;; (print (unwrap! (nft-get-owner? cool-nft token-id) nft-not-found-err))
		;; (print (nft-get-owner? cool-nft token-id))
		(print (is-eq none (nft-get-owner? cool-nft u10)))
		(if
			(is-eq none (nft-get-owner? cool-nft token-id))
      (match (nft-mint?  cool-nft token-id tx-sender)
        success (ok success)
        error (nft-transfer-err error))
			nft-not-owned-err)
			))
